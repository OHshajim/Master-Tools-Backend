const express = require("express");
const router = express.Router();

const { createNotification, deleteNotification, updateNotification, getNotificationById, getNotifications, markAsRead } = require("../controllers/notificationController");
const { requireAuth } = require("../middleware/authMiddleware");


router.post("/", createNotification);        // Create
router.get("/", getNotifications);           // Get all
router.get("/:id", getNotificationById);     // Get one
router.put("/:id", updateNotification);      // Update
router.delete("/:id", deleteNotification);   // Delete
router.patch("/:id/read",requireAuth, markAsRead);  // Mark as read

module.exports = router;
