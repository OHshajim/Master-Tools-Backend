import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userName: {
            type: String,
            required: true,
            trim: true,
        },
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plans",
            required: true,
        },
        planName: {
            type: String,
            required: true,
        },
        expirationDate: {
            type: Date,
            required: true,
        },
        originalPrice: {
            type: Number,
            required: true,
        },
        finalPrice: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["credit_card", "bank_transfer", "other"],
            default: "bank_transfer",
        },
        paymentLastFour: {
            type: String,
            minlength: 4,
            maxlength: 4,
        },
        couponCode: {
            type: String,
            required: true,
        },
        couponDiscount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "failed", "canceled"],
            default: "pending",
        },
        date: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Orders", OrderSchema);
