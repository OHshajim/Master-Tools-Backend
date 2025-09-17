const Tutorial = require("../models/Tutorials");

// Create or overwrite a tutorial
const createOrUpdateTutorial = async (req, res) => {
    try {
        const { _id, contentUrl, description, thumbnailUrl, title, type } =
            req.body;

        const tutorial = await Tutorial.findOneAndUpdate(
            { _id },
            { contentUrl, description, thumbnailUrl, title, type },
            { upsert: true, new: true }
        );

        res.status(200).json(tutorial);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all tutorials
const getAllTutorials = async (req, res) => {
    try {
        const tutorials = await Tutorial.find({});
        res.status(200).json(tutorials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete tutorial
const deleteTutorial = async (req, res) => {
    try {
        const tutorial = await Tutorial.findByIdAndDelete(req.params.id);
        if (!tutorial)
            return res.status(404).json({ message: "Tutorial not found" });
        res.status(200).json({ message: "Tutorial deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createOrUpdateTutorial,
    getAllTutorials,
    deleteTutorial,
};
