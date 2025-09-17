const Credential = require("../models/Credential");

exports.getCredentials = async (req, res) => {
    try {
        const { planId } = req.query;
        const filter = planId ? { planId } : {};
        const credentials = await Credential.find(filter).sort({
            createdAt: -1,
        });
        
        res.json(credentials);
    } catch (err) {
        res.status(500).json({ error: "Server Error", details: err.message });
    }
};

exports.createCredential = async (req, res) => {
    try {
        const {
            platform,
            platformId,
            username,
            password,
            domain,
            planId,
            isDrafted,
            userId,
        } = req.body;

        // Build the credential object dynamically
        const credentialData = {
            platform,
            platformId,
            username,
            password,
            domain,
            planId,
            isDrafted,
        };

        // Add userId only if provided
        if (userId) {
            credentialData.userId = userId;
        }

        const credential = new Credential(credentialData);
        const saved = await credential.save();

        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({
            error: "Failed to create credential",
            details: err.message,
        });
    }
};

exports.updateCredential = async (req, res) => {
    try {
        const updated = await Credential.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!updated)
            return res.status(404).json({ error: "Credential not found" });

        res.json(updated);
    } catch (err) {
        res.status(400).json({
            error: "Failed to update credential",
            details: err.message,
        });
    }
};


exports.deleteCredential = async (req, res) => {
    try {
        const deleted = await Credential.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ error: "Credential not found" });

        res.json({ message: "Credential deleted successfully" });
    } catch (err) {
        res.status(400).json({
            error: "Failed to delete credential",
            details: err.message,
        });
    }
};


exports.getSpecificCredentials = async (req, res) => {
    try {
        const { planId } = req.query;

        let filter = { userId: { $exists: true, $ne: null } };
        if (planId) {
            filter.planId = planId;
        }

        const credentials = await Credential.find(filter).sort({
            createdAt: -1,
        });

        res.json(credentials);
    } catch (err) {
        res.status(500).json({ error: "Server Error", details: err.message });
    }
};