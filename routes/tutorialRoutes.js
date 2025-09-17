const express = require("express");
const router = express.Router();
const tutorialController = require("../controllers/tutorialController");
const { authorize ,requireAuth} = require("../middleware/authMiddleware");


router.post("/", requireAuth, authorize("admin"), tutorialController.createOrUpdateTutorial);
router.get("/", tutorialController.getAllTutorials);
router.delete("/:id",requireAuth, authorize("admin"), tutorialController.deleteTutorial);

module.exports = router;
