const CopyButtonVisibility = require("../models/CopyButtonVisibility");

// GET /copy-visibility → resolve state
const getVisibilityState = async (req, res) => {
    try {
        const records = await CopyButtonVisibility.find();
        
        let globalVisibility = {
            isVisible: true,
            updatedAt: new Date().toISOString(),
        };
        const global = records.find((r) => r.type === "global");
        if (global) {
            globalVisibility = {
                isVisible: global.isVisible,
                updatedAt: global.updatedAt,
            };
        }

        const planVisibility = records
            .filter((r) => r.type === "plan")
            .map((r) => ({
                planId: r.planId,
                isVisible: r.isVisible,
                updatedAt: r.updatedAt,
            }));

        const platformVisibility = records
            .filter((r) => r.type === "platform")
            .map((r) => ({
                id: r._id,
                platformId: r.platformId,
                planId: r.planId,
                isVisible: r.isVisible,
                updatedAt: r.updatedAt,
            }));

        res.json({ globalVisibility, planVisibility, platformVisibility });
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch visibility data",
            error: err.message,
        });
    }
};

// PUT /copy-visibility/global
const updateGlobalVisibility = async (req, res) => {
    try {
        const { isVisible } = req.body;

        const updated = await CopyButtonVisibility.findOneAndUpdate(
            { type: "global" },
            { isVisible, updatedAt: new Date() },
            { upsert: true, new: true }
        );

        res.json(updated);
    } catch (err) {
        res.status(500).json({
            message: "Failed to update global setting",
            error: err.message,
        });
    }
};

// PUT /copy-visibility/plan/:planId
const updatePlanVisibility = async (req, res) => {
    try {
        const { planId } = req.params;
        const { isVisible } = req.body;

        const updated = await CopyButtonVisibility.findOneAndUpdate(
            { type: "plan", planId },
            { isVisible, updatedAt: new Date() },
            { upsert: true, new: true }
        );

        res.json(updated);
    } catch (err) {
        res.status(500).json({
            message: "Failed to update plan setting",
            error: err.message,
        });
    }
};

// PUT /copy-visibility/platform/:platformId
const updatePlatformVisibility = async (req, res) => {
    try {
        const { platformId } = req.params;
        const { planId, isVisible } = req.body;

        const updated = await CopyButtonVisibility.findOneAndUpdate(
            { type: "platform", platformId, planId },
            { isVisible, updatedAt: new Date() },
            { upsert: true, new: true }
        );

        res.json(updated);
    } catch (err) {
        res.status(500).json({
            message: "Failed to update platform setting",
            error: err.message,
        });
    }
};

module.exports = {
    getVisibilityState,
    updateGlobalVisibility,
    updatePlanVisibility,
    updatePlatformVisibility,
};
