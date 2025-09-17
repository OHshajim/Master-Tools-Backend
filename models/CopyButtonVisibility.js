const mongoose = require("mongoose");

const copyButtonVisibilitySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["global", "plan", "platform"],
        required: true,
    },
    platformId: { type: String, default: null },
    planId: { type: String, default: null },
    isVisible: { type: Boolean, required: true, default: true },
    updatedAt: { type: Date, default: Date.now },
});

const CopyButtonVisibility = mongoose.model(
    "CopyButtonVisibility",
    copyButtonVisibilitySchema
);

module.exports = CopyButtonVisibility;
