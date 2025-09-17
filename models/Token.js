const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    _id: {type: String,required: true,},
    name: { type: String, required: true },
    role: { type: String, required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    lastUsed: { type: Date },
    targetPlanIds: [{ type: String }],
});

module.exports = mongoose.model("Token", tokenSchema);
