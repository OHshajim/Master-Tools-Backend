const { Schema, model } = require("mongoose");

const DeviceInfoSchema = new Schema(
    {
        browser: String,
        browserVersion: String,
        os: String,
        osVersion: String,
        device: String,
        vendor: String,
        model: String,
        type: { type: String, default: "desktop" },
    },
    { _id: false }
);

const UserSessionSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
        sessionId: { type: String, unique: true, index: true },
        refreshTokenHash: { type: String, select: false },
        deviceFingerprint: { type: String, index: true },
        deviceInfo: DeviceInfoSchema,
        ipAddress: String,
        loginMethod: {
            type: String,
            enum: ["email", "google", "microsoft"],
            default: "email",
        },
        isActive: { type: Boolean, default: true },
        lastUsedAt: { type: Date, default: Date.now },
        expiresAt: { type: Date },
        revokedReason: String,
    },
    { timestamps: true }
);

UserSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = model("UserSession", UserSessionSchema);
