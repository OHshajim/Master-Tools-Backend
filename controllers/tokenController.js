const Token = require("../models/Token");

/**
 * Create new token
 */
exports.createToken = async (req, res) => {
    try {
        const { name, role, description, expiresAt, targetPlanIds, token,_id } = req.body;

        const newToken = new Token({
            _id,
            name,
            role,
            description,
            expiresAt,
            targetPlanIds,
            token
        });

        await newToken.save();
        res.status(201).json(newToken);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Update token status (activate/deactivate)
 */
exports.updateTokenStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const updated = await Token.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );

        if (!updated)
            return res.status(404).json({ message: "Token not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Delete token
 */
exports.deleteToken = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Token.findByIdAndDelete(id);

        if (!deleted)
            return res.status(404).json({ message: "Token not found" });
        res.json({ message: "Token deleted", id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Update last used
 */
exports.updateLastUsed = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await Token.findByIdAndUpdate(
            id,
            { lastUsed: new Date() },
            { new: true }
        );

        if (!updated)
            return res.status(404).json({ message: "Token not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Get tokens for a specific plan
 */
exports.getTokensForPlan = async (req, res) => {
    try {
        const { planId } = req.params;

        const tokens = await Token.find({
            isActive: true,
            expiresAt: { $gt: new Date() },
            $or: [
                { targetPlanIds: { $exists: false } },
                { targetPlanIds: { $size: 0 } },
                { targetPlanIds: planId },
            ],
        });

        res.json(tokens);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getTokens = async (req, res) => {
    try {
        const tokens = await Token.find({expiresAt: { $gt: new Date() }
        });

        res.json(tokens);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
