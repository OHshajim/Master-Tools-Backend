const Session = require("../models/UserSession");
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} = require("../utils/jwt");
const { randomId, hashToken } = require("../utils/crypto");
const { setRefreshCookie, clearRefreshCookie } = require("../utils/cookies");
const UAParser = require("ua-parser-js");
const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { getResetEmailHtml, getResetEmailText } = require("../config/email");

// ----- Limit sessions per user/browser -----
const limitSessions = async (userId, deviceFingerprint) => {
    const sessions = await Session.find({ userId, isActive: true }).sort({
        createdAt: 1,
    });

    // 3 per device/browser
    const deviceSessions = sessions.filter(
        (s) => s.deviceFingerprint === deviceFingerprint
    );
    if (deviceSessions.length >= 3) {
        await Session.deleteOne({ _id: deviceSessions[0]._id });
    }

    // Optional: total 3 sessions per user
    if (sessions.length >= 3) {
        await Session.deleteOne({ _id: sessions[0]._id });
    }
};

// ----- Device Info -----
const buildDeviceInfo = (req) => {
    const parser = new UAParser(req.get("User-Agent"));
    const r = parser.getResult();
    return {
        browser: r.browser.name,
        browserVersion: r.browser.version,
        os: r.os.name,
        osVersion: r.os.version,
        device: r.device.model || "Unknown",
        vendor: r.device.vendor,
        model: r.device.model,
        type: r.device.type || "desktop",
    };
};

// ----- Issue tokens and create session -----
const issueTokensAndSession = async (user, req) => {
    const deviceFingerprint = randomId(16);

    // Limit sessions
    await limitSessions(user._id, deviceFingerprint);

    // Create session
    const sessionId = crypto.randomUUID();

    const session = new Session({
        userId: user._id,
        sessionId,
        deviceFingerprint,
        deviceInfo: buildDeviceInfo(req),
        ipAddress: req.ip,
        loginMethod: "email",
        isActive: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await session.save();

    // Create tokens
    const access = signAccessToken({
        sub: user._id.toString(),
        role: user.role,
        tv: user.tokenVersion,
        sid: sessionId,
    });

    const refresh = signRefreshToken({
        sub: user._id.toString(),
        tv: user.tokenVersion,
        sid: sessionId,
    });

    session.refreshTokenHash = hashToken(refresh);
    await session.save();

    return { access, refresh };
};

// ----- Register -----
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists)
        return res
            .status(400)
            .json({ success: false, message: "Email in use" });

    const user = await User.create({ name, email, password });
    const { access, refresh } = await issueTokensAndSession(user, req);

    setRefreshCookie(res, refresh);
    return res.status(201).json({
        success: true,
        accessToken: access,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            authProvider: user.oauthProviders,
        },
    });
};

// ----- Login -----
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user)
        return res
            .status(401)
            .json({ success: false, message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok)
        return res
            .status(401)
            .json({ success: false, message: "Invalid credentials" });
    if (user.blocked)
        return res
            .status(403)
            .json({ success: false, message: "Account blocked" });

    const { access, refresh } = await issueTokensAndSession(user, req);

    setRefreshCookie(res, refresh);
    return res.status(200).json({
        success: true,
        accessToken: access,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            authProvider: user.oauthProviders,
        },
    });
};

exports.oauthLogin = async (req, res) => {
    try {
        const { provider, providerId, email, name } = req.body;

        if (!provider || !providerId || !email || !name || !["google", "microsoft"].includes(provider)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid OAuth data" });
        }

        // 🔍 Step 1: Find or create user
        let user = await User.findOne({
            "oauthProviders.provider": provider,
            "oauthProviders.providerId": providerId,
        });
        if (!user && email) {
            user = await User.findOne({ email });
        }
        if (!user) {
            user = await User.create({
                email,
                name,
                oauthProviders: [
                    {
                        provider,
                        providerId,
                    },
                ],
            });
        }
        else {
            const hasProvider = user.oauthProviders.some(
                (p) => p.provider === provider && p.providerId === providerId
            );
            if (!hasProvider) {
                user.oauthProviders.push({ provider, providerId: providerId });
                await user.save();
            }
        }

        const { access, refresh } = await issueTokensAndSession(user, req);
        setRefreshCookie(res, refresh);
        return res.status(200).json({
            success: true,
            accessToken: access,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                authProvider: user.oauthProviders,
            },
        });
    } catch (error) {
        console.error("OAuth login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ----- Refresh token -----
exports.refresh = async (req, res) => {
    try {
        const token = req.cookies.refresh_token;
        
        if (!token)
            return res.status(401).json({ message: "Missing refresh token" });
        
        const decoded = verifyRefreshToken(token);
        
        const session = await Session.findOne({
            sessionId: decoded.sid,
            userId: decoded.sub,
            isActive: true,
        });
        
        if (!session)
            return res
        .status(401)
        .json({ message: "Session invalid or expired" });
        
        const user = await User.findById(decoded.sub);
        if (!user) return res.status(401).json({ message: "User not found" });
        
        // Rotate tokens
        const access = signAccessToken({
            sub: user._id.toString(),
            role: user.role,
            tv: user.tokenVersion,
            sid: decoded.sid,
        });
        
        const refresh = signRefreshToken({
            sub: user._id.toString(),
            tv: user.tokenVersion,
            sid: decoded.sid,
        });
        
        session.refreshTokenHash = hashToken(refresh);
        session.lastUsedAt = new Date();
        session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await session.save();
        
        setRefreshCookie(res, refresh);
        return res.status(200).json({ success: true, accessToken: access });
    } catch (err) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }
};

// ----- Logout -----
exports.logout = async (req, res) => {
    const token = req.cookies.refresh_token;
    if (token) {
        try {
            const decoded = verifyRefreshToken(token);
            await Session.updateMany(
                { userId: decoded.sub, sessionId: decoded.sid, isActive: true },
                {
                    isActive: false,
                    revokedReason: "User logout",
                    expiresAt: new Date(),
                }
            );
        } catch (_) {}
    }
    clearRefreshCookie(res);
    return res.status(200).json({ success: true, message: "Logged out" });
};

// ----- Logout all -----
exports.logoutAll = async (req, res) => {
    const userId = req.user._id;
    await Session.updateMany(
        { userId, isActive: true },
        { isActive: false, revokedReason: "Logout all", expiresAt: new Date() }
    );
    
    clearRefreshCookie(res);
    return res
        .status(200)
        .json({ success: true, message: "Logged out from all devices" });
};

// ----- Get current user -----
exports.getMe = async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    return res.status(200).json({
        success: true,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            authProvider: user.oauthProviders,
        },
    });
};


// ----- Forget Password -----
// 📩 Step 1: Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email }).select("+password");
    
    if (!user || !user.password) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min expiry
    await user.save();

    // Create reset URL
    const resetURL = `${process.env.CLIENT_ORIGIN}/reset-password?email=${email}&token=${resetToken}`;

    // Send email
        const html = getResetEmailHtml(user, resetURL);
        const text = getResetEmailText(user, resetURL);
    try {
        await sendEmail(user.email, "Reset Your Password", html,text);
        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email.",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to send email. Try again later.",
        });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔒 Step 2: Reset Password
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    const hashed = hashToken(token);

    const user = await User.findOne({
        resetPasswordToken: hashed,
        resetPasswordExpire: { $gt: new Date() },
    }).select("+password");

    if (!user || !user.password) {
        return res
            .status(400)
            .json({ success: false, message: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.tokenVersion += 1; // Invalidate old tokens
    user.lastPasswordChanged = new Date();
    await user.save();

    return res
        .status(200)
        .json({ success: true, message: "Password reset successful" });
};


// change Password
exports.changePassword = async (req, res) => {
  try {
      const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res
        .status(400)
        .json({ message: "Both old and new passwords are required" });
    }
    const user = await User.findById(req.user.id).select("+password");
    
    if (!user || !user.password) return res.status(404).json({ message: "User not found" });

    const ok = await user.comparePassword(currentPassword);
    if (!ok)return res.status(401).json({ success: false, message: "Invalid credentials" });

    user.password = newPassword;
    user.tokenVersion += 1;
    user.lastPasswordChanged = new Date();
    await user.save();

    await Session.updateMany(
        { userId: user._id, isActive: true, sessionId: { $ne: req.sessionId } },
        {
            isActive: false,
            revokedReason: "Password changed",
            expiresAt: new Date(),
        }
    );

    res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
  }
};

exports.changeName = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name;
    await user.save();

    res.status(200).json({
      message: "Name updated successfully.",
    });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
  }
};