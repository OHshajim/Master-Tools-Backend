const mongoose = require('mongoose');

const QuickLinksSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please add a platform name"],
        },
        url: {
            type: String,
            required: [true, "Please add a URL"],
            trim: true,
        },
        order: {
            type: Number,
        },
        icon: {
            type: String,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('QuickLinks', QuickLinksSchema);
