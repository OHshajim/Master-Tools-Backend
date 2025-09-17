import Notification from "../models/Notification.js";
import Users from "../models/User.js";
import Orders from "../models/Orders.js";

// --- Create Notification ---
export const createNotification = async (req, res) => {
    try {
        const {
            title,
            message,
            priority,
            targetType,
            targetPlanId,
            targetUsers,
            expiresAt,
        } = req.body;

        let targetIds = [];

        switch (targetType) {
            case "all": {
                const allUsers = await Users.find({}, "_id");
                targetIds = allUsers.map((u) => u._id);
                break;
            }

            case "purchased": {
                // Users who have at least one order
                const purchasedUserIds = await Orders.distinct("userId");
                targetIds = purchasedUserIds;
                break;
            }

            case "non-purchased": {
                // Users who registered but never ordered
                const purchasedUserIds = await Orders.distinct("userId");
                const allUsers = await Users.find({}, "_id");
                targetIds = allUsers
                    .map((u) => u._id.toString())
                    .filter((id) => !purchasedUserIds.includes(id));
                break;
            }

            case "specific-plan": {
                if (targetPlanId) {
                    const orders = await Orders.find(
                        { planId: targetPlanId },
                        "userId"
                    );
                    targetIds = orders.map((o) => o.userId);
                }
                break;
            }

            case "specific-users": {
                targetIds = targetUsers || [];
                break;
            }

            default:
                targetIds = [];
        }

        const notification = await Notification.create({
            title,
            message,
            priority,
            targetType,
            targetPlanId: targetPlanId || null,
            targetUsers: targetIds,
            targetCount: targetIds.length,
            expiresAt,
        });

        res.status(201).json({ success: true, notification });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// --- Get All Notifications ---
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.json({ success: true, notifications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// --- Get Single Notification ---
export const getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res
                .status(404)
                .json({ success: false, message: "Notification not found" });
        }
        res.json({ success: true, notification });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// --- Update Notification ---
export const updateNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!notification) {
            return res
                .status(404)
                .json({ success: false, message: "Notification not found" });
        }
        res.json({ success: true, notification });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// --- Delete Notification ---
export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(
            req.params.id
        );
        if (!notification) {
            return res
                .status(404)
                .json({ success: false, message: "Notification not found" });
        }
        res.json({
            success: true,
            message: "Notification deleted successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// --- Mark as Read ---
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const { id:userId } = req.user;

        if (!userId) {
            return res
                .status(400)
                .json({ success: false, message: "User ID is required" });
        }

        const notification = await Notification.findById(id);
        if (!notification) {
            return res
                .status(404)
                .json({ success: false, message: "Notification not found" });
        }

        if (!notification.isReadBy?.includes(userId)) {
            notification.isReadBy.push(userId);
            await notification.save();
        }

        res.json({ success: true, notification });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};
