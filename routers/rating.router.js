const express = require("express"),
	router = express.Router(),
	ratingController = require("../controllers/rating.controller");
const authenticateUser = require("../middlewares/authentication");

router.post("/create", authenticateUser, ratingController.createRating);
router.get("/", ratingController.getRatings);
router.get("/:id", authenticateUser, ratingController.getRatingId);
router.put("/update/:id", authenticateUser, ratingController.updateRatingId);
router.delete("/delete/:id", authenticateUser, ratingController.deleteRatingId);

module.exports = router;
