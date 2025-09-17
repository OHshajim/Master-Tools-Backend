const express = require("express");
const router = express.Router();
const {
    createPlatform,
    getPlatforms,
    getPlatformById,
    updatePlatform,
    deletePlatform,
} = require("../controllers/platformController");

// CRUD routes
router.post("/", createPlatform);
router.get("/", getPlatforms);
router.get("/:id", getPlatformById);
router.put("/:id", updatePlatform);
router.delete("/:id", deletePlatform);

module.exports = router;
