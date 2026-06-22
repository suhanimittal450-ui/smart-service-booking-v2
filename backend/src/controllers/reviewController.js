const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Service = require("../models/Service");

/*
=====================================
UPDATE SERVICE RATING
=====================================
*/
const updateServiceRating = async (serviceId) => {
  const reviews = await Review.find({
    service: serviceId,
  });

  const numReviews = reviews.length;

  const averageRating =
    numReviews > 0
      ? reviews.reduce((acc, item) => acc + item.rating, 0) / numReviews
      : 0;

  await Service.findByIdAndUpdate(serviceId, {
    averageRating,
    numReviews,
  });
};

/*
=====================================
CREATE REVIEW
=====================================
*/

exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Service not completed yet",
      });
    }

    const alreadyReviewed = await Review.findOne({
      booking: bookingId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "Review already submitted",
      });
    }

    const review = await Review.create({
      customer: req.user._id,
      service: booking.service,
      booking: bookingId,
      rating,
      comment,
    });

    await updateServiceRating(booking.service);

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=====================================
GET SERVICE REVIEWS
=====================================
*/

exports.getServiceReviews = async (req, res) => {
  try {
    console.log("SERVICE ID =>", req.params.serviceId);

    const reviews = await Review.find({
      service: req.params.serviceId,
    });

    console.log("REVIEWS FOUND =>", reviews);

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
