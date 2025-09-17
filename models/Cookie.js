const mongoose = require("mongoose");

const CookieSchema = new mongoose.Schema(
    {
        planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plans", required: true },
        platform: { type: String, required: [true, "Platform is required"], ref: "Platform", trim: true },
        platformId: { type: String, required: [true, "Platform ID is required"], trim: true },
        name: { type: String, required: true },
        value: { type: String, required: true },
        cookieData: { type: String },
        domain: { type: String },
        updatedAt: { type: Date, default: Date.now },
        isPinned: { type: Boolean, default: false },
        pinnedAt: { type: Date },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        isDrafted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cookie", CookieSchema);
