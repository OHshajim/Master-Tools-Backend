const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const OAuthProviderSchema = new mongoose.Schema(
    {
        provider: {type: String,enum: ["google", "microsoft"],required: true},
        providerId: { type: String, required: true },
    },
    { _id: false }
);

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, trim: true },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            index: true,
            sparse: true,
        },
        password: { type: String, select: false },
        role: {
            type: String,
            enum: ["user", "admin", "manager", "support"],
            default: "user",
        },
        blocked: { type: Boolean, default: false },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        oauthProviders: {
            type: [OAuthProviderSchema],
            default: [],
        },
        // Token invalidation at user level (e.g., password change)
        tokenVersion: { type: Number, default: 0 },
        // Password reset
        resetPasswordToken: { type: String, select: false },
        resetPasswordExpire: { type: Date, select: false },
        lastPasswordChanged: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
});

UserSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", UserSchema);
