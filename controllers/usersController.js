const User = require("../models/User");

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select(
            "-password -resetPasswordToken -resetPasswordExpire"
        );
        res.json({
            users,
            success:true
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch users",
            error: err.message,
            success: false,
        });
    }
};

// Get single user
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select(
            "-password -resetPasswordToken -resetPasswordExpire"
        );
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch user",
            error: err.message,
        });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {  role },
            { new: true }
        ).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({
            message: "Failed to update user",
            error: err.message,
        });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete user",
            error: err.message,
        });
    }
};

// Block user
exports.blockUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { blocked: true },
            { new: true }
        );
        res.json({ message: "User blocked", user });
    } catch (err) {
        res.status(500).json({
            message: "Failed to block user",
            error: err.message,
        });
    }
};

// Unblock user
exports.unblockUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { blocked: false },
            { new: true }
        );
        res.json({ message: "User unblocked", user });
    } catch (err) {
        res.status(500).json({
            message: "Failed to unblock user",
            error: err.message,
        });
    }
};

const UserSession = require("../models/UserSession");

// Get all sessions for a user
exports.getUserSessions = async (req, res) => {
    try {
        const sessions = await UserSession.find({
            userId: req.params.id,
        }).select("-refreshTokenHash");
        res.json(sessions);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch sessions",
            error: err.message,
        });
    }
};

// Revoke single session
exports.revokeSession = async (req, res) => {
    try {
        const session = await UserSession.findOneAndUpdate(
            { userId: req.params.id, sessionId: req.params.sessionId },
            { isActive: false, revokedReason: "Revoked by admin" },
            { new: true }
        );
        if (!session)
            return res.status(404).json({ message: "Session not found" });
        res.json({ message: "Session revoked", session });
    } catch (err) {
        res.status(500).json({
            message: "Failed to revoke session",
            error: err.message,
        });
    }
};

// Revoke all sessions for a user
exports.revokeAllSessions = async (req, res) => {
    try {
        await UserSession.updateMany(
            { userId: req.params.id, isActive: true },
            { isActive: false, revokedReason: "Revoked all by admin" }
        );
        res.json({ message: "All sessions revoked" });
    } catch (err) {
        res.status(500).json({
            message: "Failed to revoke sessions",
            error: err.message,
        });
    }
};
