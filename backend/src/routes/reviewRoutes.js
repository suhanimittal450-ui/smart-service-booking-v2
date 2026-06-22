const express = require("express");

const router = express.Router();

const {
  createReview,
  getServiceReviews,
} = require("../controllers/reviewController");

const { protect, authorize } = require("../middleware/authMiddleware");

/*
=====================================
CUSTOMER REVIEW
=====================================
*/

router.post("/", protect, authorize("customer"), createReview);

/*
=====================================
GET SERVICE REVIEWS
=====================================
*/

router.get("/service/:serviceId", getServiceReviews);

module.exports = router;
