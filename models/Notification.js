const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        message: { type: String, required: true },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        targetType: {
            type: String,
            enum: ["all", "specific-plan", "specific-users", "non-purchased"],
            default: "all",
        },
        targetPlanId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plans",
            default: null,
        },
        targetUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
        targetCount: { type: Number, default: 0 },
        expiresAt: { type: Date, default: null },
        isReadBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notifications", NotificationSchema);
