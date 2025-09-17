const Platform = require("../models/Platform");

// Create a new platform
exports.createPlatform = async (req, res) => {
    try {
        const { name, url, description, logo } = req.body;

        // Validate required fields
        if (!name || !url || !description) {
            return res.status(400).json({
                success: false,
                message: "Name, URL, and description are required",
            });
        }

        // Check if platform already exists
        const existing = await Platform.findOne({ name });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Platform with this name already exists",
            });
        }

        const platform = await Platform.create({
            name,
            url,
            description,
            logo,
        });
        res.status(201).json({ success: true, platform });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get all platforms
exports.getPlatforms = async (req, res) => {
    try {
        const platforms = await Platform.find();
        res.json({ success: true, platforms });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get platform by ID
exports.getPlatformById = async (req, res) => {
    try {
        const platform = await Platform.findById(req.params.id);
        if (!platform) {
            return res
                .status(404)
                .json({ success: false, message: "Platform not found" });
        }
        res.json({ success: true, platform });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update a platform
exports.updatePlatform = async (req, res) => {
    try {
        const { name, url, description, logo } = req.body;

        // Optional: validate fields
        if (name && name.length > 50) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Name cannot be more than 50 characters",
                });
        }

        const platform = await Platform.findByIdAndUpdate(
            req.params.id,
            { name, url, description, logo },
            { new: true, runValidators: true }
        );

        if (!platform) {
            return res
                .status(404)
                .json({ success: false, message: "Platform not found" });
        }

        res.json({ success: true, platform });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete a platform
exports.deletePlatform = async (req, res) => {
    try {
        const platform = await Platform.findByIdAndDelete(req.params.id);
        if (!platform) {
            return res
                .status(404)
                .json({ success: false, message: "Platform not found" });
        }
        res.json({ success: true, message: "Platform deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
