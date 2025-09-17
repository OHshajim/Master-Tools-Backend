const QuickLinks = require("../models/QuickLinks");

exports.getQuickLinks = async (req, res) => {
    try {
        const links = await QuickLinks.find().sort({ order: 1 }); // sort by time desc
        res.json(links);
    } catch (err) {
        res.status(500).json({ error: "Server Error", details: err.message });
    }
};

exports.createQuickLink = async (req, res) => {
    try {
        const { title, url, icon } = req.body;
        const newLink = new QuickLinks({
            title,
            url,
            icon: icon || null,
        });
        const saved = await newLink.save();
        
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({
            error: "Failed to create link",
            details: err.message,
        });
    }
};


exports.updateQuickLink = async (req, res) => {
    try {
        const updated = await QuickLinks.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updated) return res.status(404).json({ error: "Link not found" });

        res.json(updated);
    } catch (err) {
        res.status(400).json({
            error: "Failed to update link",
            details: err.message,
        });
    }
};

exports.deleteQuickLink = async (req, res) => {
    try {
        const deleted = await QuickLinks.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Link not found" });

        res.json({ message: "Link deleted successfully" });
    } catch (err) {
        res.status(400).json({
            error: "Failed to delete link",
            details: err.message,
        });
    }
};


exports.reorderQuickLink = async (req, res) => {
    try {
        const { order } = req.body;
        if (!order) {
            return res.status(400).json({ error: "order is required" });
        }

        const updated = await QuickLinks.findByIdAndUpdate(
            req.params.id,
            { order: order },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: "Link not found" });

        res.json(updated);
    } catch (err) {
        res.status(400).json({
            error: "Failed to reorder link",
            details: err.message,
        });
    }
};
