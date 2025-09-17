const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require("../models/UserSession");
const { verifyAccessToken } = require("../utils/jwt");

// Protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user to request object
      req.user = await User.findById(decoded.id);

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    next(error);
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    
    next();
  };
};

exports.requireAuth = async (req, res, next) => {
    try {
        const auth = req.headers.authorization || "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
        if (!token)
            return res
                .status(401)
                .json({ success: false, message: "Missing access token" });

        const decoded = verifyAccessToken(token);
        
        const user = await User.findById(decoded.sub);
        if (!user)
            return res
                .status(401)
                .json({ success: false, message: "User not found" });
        if (user.blocked)
            return res
                .status(403)
                .json({ success: false, message: "Account blocked" });
        if ((decoded.tv ?? 0) !== (user.tokenVersion ?? 0)) {
            return res
                .status(401)
                .json({ success: false, message: "Token no longer valid" });
        }
        // ✅ check if session exists
        const session = await Session.findOne({
            sessionId: decoded.sid,
            userId: decoded.sub,
            isActive: true,
        });
        if (!session) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Session invalid or expired",
                });
        }

        req.user = { id: user._id, role: user.role };
        req.sessionId = decoded.sid;
        next();
    } catch (err) {
        const code = err.name === "TokenExpiredError" ? 401 : 401;
        return res
            .status(code)
            .json({
                success: false,
                message:
                    err.name === "TokenExpiredError"
                        ? "Access token expired"
                        : "Invalid token",
            });
    }
};