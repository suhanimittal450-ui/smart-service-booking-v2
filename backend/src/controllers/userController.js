const User = require("../models/User");
const Booking = require("../models/Booking");
const Service = require("../models/Service");

/*
=====================================
CUSTOMER DASHBOARD (stats)
=====================================
*/

exports.customerDashboard = async (req, res) => {
  try {
    const customerId = req.user._id;

    const [totalBookings, pending, completed, bookings] = await Promise.all([
      Booking.countDocuments({ customer: customerId }),
      Booking.countDocuments({ customer: customerId, status: "pending" }),
      Booking.countDocuments({ customer: customerId, status: "completed" }),
      Booking.find({ customer: customerId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("service", "title price")
        .populate("provider", "name"),
    ]);

    res.status(200).json({
      success: true,
      user: req.user,
      stats: { totalBookings, pending, completed },
      recentBookings: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
=====================================
PROVIDER DASHBOARD (stats)
=====================================
*/

exports.providerDashboard = async (req, res) => {
  try {
    const providerId = req.user._id;

    const [totalServices, totalBookings, pending, completed, bookings, earningsAgg] =
      await Promise.all([
        Service.countDocuments({ provider: providerId }),
        Booking.countDocuments({ provider: providerId }),
        Booking.countDocuments({ provider: providerId, status: "pending" }),
        Booking.countDocuments({ provider: providerId, status: "completed" }),
        Booking.find({ provider: providerId })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate("service", "title price")
          .populate("customer", "name"),
        Booking.aggregate([
          { $match: { provider: providerId, paymentStatus: "paid" } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
      ]);

    res.status(200).json({
      success: true,
      user: req.user,
      stats: {
        totalServices,
        totalBookings,
        pending,
        completed,
        earnings: earningsAgg[0]?.total || 0,
      },
      recentBookings: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
=====================================
ADMIN DASHBOARD (platform-wide stats)
=====================================
*/

exports.adminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCustomers,
      totalProviders,
      totalAdmins,
      totalServices,
      totalBookings,
      revenueAgg,
      recentUsers,
      recentBookings,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "provider" }),
      User.countDocuments({ role: "admin" }),
      Service.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      User.find().sort({ createdAt: -1 }).limit(5).select("-password"),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("customer", "name")
        .populate("provider", "name")
        .populate("service", "title"),
    ]);

    res.status(200).json({
      success: true,
      user: req.user,
      stats: {
        totalUsers,
        totalCustomers,
        totalProviders,
        totalAdmins,
        totalServices,
        totalBookings,
        revenue: revenueAgg[0]?.total || 0,
      },
      recentUsers,
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
=====================================
ADMIN: LIST ALL USERS (optional ?role= filter)
=====================================
*/

exports.getAllUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;

    const users = await User.find(filter).sort({ createdAt: -1 }).select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
=====================================
ADMIN: DELETE A USER
=====================================
*/

exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
