import DraftPlatform from "../models/DraftPlatform.js";

export const createDraft = async (req, res) => {
    try {
        const { userId, planId, platformId, type } = req.body;
        const draft = new DraftPlatform({
            userId,
            planId,
            platformId,
            type,
            draftedBy: req.user.id,
            draftedDate: new Date(),
        });

        const savedDraft = await draft.save();
        res.status(201).json(savedDraft);
    } catch (error) {
        res.status(500).json({ message: "Failed to create draft", error });
    }
};

// Get all drafts
export const getDrafts = async (req, res) => {
    try {
        const drafts = await DraftPlatform.find()
            .sort({ createdAt: -1 });
        res.json(drafts);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch drafts", error });
    }
};

// Delete draft
export const deleteDraft = async (req, res) => {
    try {
        const draft = await DraftPlatform.findByIdAndDelete(req.params.id);

        if (!draft) {
            return res.status(404).json({ message: "Draft not found" });
        }

        res.json({ message: "Draft removed successfully", id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete draft", error });
    }
};

export const toggleDraftPlatform = async (req, res) => {
    try {
        const { userId, planId, platformId, type, draftedBy } =
            req.body;

        if (!userId || !planId || !platformId || !type || !draftedBy) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if draft exists
        const existingDraft = await DraftPlatform.findOne({
            userId,
            planId,
            platformId,
            type,
        });

        if (existingDraft) {
            await existingDraft.deleteOne();
            return res.status(200).json({ message: "Draft removed" });
        } else {
            // Add draft
            const newDraft = await DraftPlatform.create({
                userId,
                planId,
                platformId: platformId,
                type: credentialType,
                draftedBy,
            });

            return res.status(201).json(newDraft);
        }
    } catch (error) {
        console.error("Toggle Draft Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};