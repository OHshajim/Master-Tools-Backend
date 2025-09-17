const Cookie = require("../models/Cookie");
const User = require("../models/User");

// Create new cookie
exports.createCookie = async (req, res) => {
    try {
        const cookie = await Cookie.create(req.body);
        res.status(201).json(cookie);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all cookies
exports.getCookies = async (req, res) => {
    try {
        const { userId, planId, isAll } = req.query;
        const filter = {};

        if (planId) filter.planId = planId;

        if (userId) {
            filter.$or = [
                { userId: userId },
                { userId: { $exists: false } },
            ];
        } 
        else if( !isAll) {
            filter.userId = { $exists: false };
        }

        const cookies = await Cookie.find(filter).sort({ updatedAt: -1 });
        res.json(cookies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserCookies = async (req, res) => {
    try {
        
        const { userId } = req.query;
        let filter = { userId: { $exists: true, $ne: null } };

        if (userId) {
            filter.userId = userId;
        }
        const cookies = await Cookie.find(filter).sort({
            updatedAt: -1,
        });
        res.json(cookies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update cookie
exports.updateCookie = async (req, res) => {
    try {
        const cookie = await Cookie.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        if (!cookie) return res.status(404).json({ error: "Cookie not found" });
        res.json(cookie);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateCookieForEx = async (req, res) => {
    try {
        const cookie = await Cookie.findByIdAndUpdate(
            req.params.platform,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        if (!cookie) return res.status(404).json({ error: "Cookie not found" });
        res.json(cookie);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete cookie
exports.deleteCookie = async (req, res) => {
    try {
        const cookie = await Cookie.findByIdAndDelete(req.params.id);
        if (!cookie) return res.status(404).json({ error: "Cookie not found" });
        res.json({ message: "Cookie deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Pin / Unpin cookie
exports.togglePin = async (req, res) => {
    try {
        const cookie = await Cookie.findById(req.params.id);
        if (!cookie) return res.status(404).json({ error: "Cookie not found" });

        cookie.isPinned = !cookie.isPinned;
        cookie.pinnedAt = cookie.isPinned ? Date.now() : null;
        await cookie.save();

        res.json(cookie);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
