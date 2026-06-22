const express = require("express");

const router = express.Router();

const {
  createBooking,
  myBookings,
  providerBookings,
  updateBookingStatus,
  getAllBookings,
  cancelBooking,
} = require("../controllers/bookingController");

const { protect, authorize } = require("../middleware/authMiddleware");

/*
=====================================
CUSTOMER
=====================================
*/

router.post("/", protect, authorize("customer"), createBooking);

router.get("/my-bookings", protect, authorize("customer"), myBookings);

router.put("/:id/cancel", protect, authorize("customer"), cancelBooking);

/*
=====================================
PROVIDER
=====================================
*/

router.get(
  "/provider-bookings",
  protect,
  authorize("provider"),
  providerBookings,
);

router.put(
  "/:id/status",
  protect,
  authorize("provider", "admin"),
  updateBookingStatus,
);

/*
=====================================
ADMIN — full oversight of every booking
=====================================
*/

router.get("/admin/all", protect, authorize("admin"), getAllBookings);

module.exports = router;
