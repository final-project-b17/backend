const express = require("express"),
    router = express.Router(),
    ratingController = require("../controllers/rating.controller");

router.post("/create", ratingController.createRating);
router.get("/", ratingController.getRatings);
router.get("/:id", ratingController.getRatingId);
router.put("/update/:id", ratingController.updateRatingId);
router.delete("/delete/:id", ratingController.deleteRatingId);

module.exports = router;