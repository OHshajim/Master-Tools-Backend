const mongoose = require("mongoose");

const DraftPlatformSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
        platformId: { type: mongoose.Schema.Types.ObjectId, ref: "Platform", required: true},
        type: { type: String, enum: ["cookie", "credential"], required: true },
        draftedBy: { type: String, required: true },
        draftedDate: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model("DraftPlatform", DraftPlatformSchema);
