const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Notification = require("../models/Notification");
/*
=====================================
CREATE BOOKING
=====================================
*/

exports.createBooking = async (req, res) => {
  try {
    const { serviceId, bookingDate, notes } = req.body;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const booking = await Booking.create({
      customer: req.user._id,
      provider: service.provider,
      service: service._id,
      bookingDate,
      notes,
      totalAmount: service.price,
    });
    await Notification.create({
      recipient: service.provider,
      title: "New Booking",
      message: "You received a new booking",
      type: "booking",
    });
    res.status(201).json({
      success: true,
      booking,
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
CUSTOMER BOOKINGS
=====================================
*/

exports.myBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customer: req.user._id,
    })
      .populate("service", "title price")
      .populate("provider", "name email");

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
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
PROVIDER BOOKINGS
=====================================
*/

exports.providerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      provider: req.user._id,
    })
      .populate("customer", "name email")
      .populate("service", "title");

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
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
ADMIN: ALL BOOKINGS
=====================================
*/

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate("customer", "name email")
      .populate("provider", "name email")
      .populate("service", "title price");

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
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
CUSTOMER: CANCEL OWN BOOKING
=====================================
*/

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (["completed", "cancelled"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Booking already ${booking.status}`,
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      booking,
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
UPDATE STATUS (provider owns booking, or admin)
=====================================
*/

exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const isOwningProvider = booking.provider.toString() === req.user._id.toString();

    if (!isOwningProvider && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    booking.status = req.body.status;

    await booking.save();

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
