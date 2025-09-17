const mongoose = require("mongoose");

const CredentialSchema = new mongoose.Schema(
    {
        platform: { type: String, required: [true, "Platform is required"], ref: "Platform", trim: true },
        platformId: { type: String, required: [true, "Platform ID is required"], trim: true },
        username: { type: String, required: [true, "Username is required"], trim: true },
        password: { type: String, required: [true, "Password is required"] },
        domain: { type: String, required: [true, "Domain is required"], trim: true },
        planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plans", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        isDrafted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Credential", CredentialSchema);
