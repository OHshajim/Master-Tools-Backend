const mongoose = require("mongoose");

const TutorialSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
        },
        thumbnailUrl: {
            type: String,
            validate: {
                validator: function (v) {
                    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
                },
                message: "Invalid thumbnail URL",
            },
        },
        contentUrl: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return /^https?:\/\/.+/i.test(v);
                },
                message: "Invalid content URL",
            },
        },
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["login", "cookie", "login-mobile", "cookie-mobile"],
            required: true,
        },
        _id: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Tutorial", TutorialSchema);
