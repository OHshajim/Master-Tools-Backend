import mongoose from "mongoose";

const ArchivePlanSchema = new mongoose.Schema(
    {

        planDetails: {
            planId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            description: { type: String },
            durationValue: { type: Number },
            durationType: {
                type: String,
                enum: ["days", "months", "years"],
            },
            stickerText: { type: String },
            showOnHomepage: { type: Boolean, default: false },
            isDraft: { type: Boolean, default: false },
        },

        // Who deleted it
        deletedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("ArchivePlans", ArchivePlanSchema);
