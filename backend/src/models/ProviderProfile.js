const mongoose = require("mongoose");

const providerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bio: String,

    experience: {
      type: Number,
      default: 0,
    },

    skills: [
      {
        type: String,
      },
    ],

    certifications: [
      {
        type: String,
      },
    ],

    portfolioImages: [
      {
        type: String,
      },
    ],

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    totalBookings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ProviderProfile", providerProfileSchema);
