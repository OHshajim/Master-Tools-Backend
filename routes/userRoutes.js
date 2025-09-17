const express = require("express");
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    blockUser,
    unblockUser,
    getUserSessions,
    revokeSession,
    revokeAllSessions,
} = require("../controllers/usersController");


const router = express.Router();

// --- User Routes ---
router.get("/", getUsers); // Get all users
router.get("/:id", getUserById); // Get single user
router.put("/:id/role", updateUser); // Update user (role)
router.delete("/:id", deleteUser); // Delete user
router.patch("/:id/block", blockUser); // Block user
router.patch("/:id/unblock", unblockUser); // Unblock user

// --- Session Routes ---
router.get("/:id/sessions", getUserSessions); // Get all sessions for a user
router.delete("/:id/sessions/:sessionId", revokeSession); // Revoke single session
router.delete("/:id/sessions", revokeAllSessions); // Revoke all sessions

module.exports = router;
