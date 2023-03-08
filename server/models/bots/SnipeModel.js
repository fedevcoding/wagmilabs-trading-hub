const mongoose = require("mongoose");

const SnipeScheme = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
    },
    tasks: [
      {
        collectionAddress: {
          type: String,
          required: true,
        },
        minPrice: {
          type: Number,
        },
        maxPrice: {
          type: Number,
          required: true,
        },
        maxAutoBuy: {
          type: Number,
          required: true,
        },
        maxPriorityFeePerGas: {
          type: Number,
          required: true,
        },
        maxFeePerGas: {},
        taskOwner: {
          type: String,
          required: true,
        },
        walletAddress: {
          type: String,
          required: true,
        },
        collectionName: {
          type: String,
        },
        collectionImage: {
          type: String,
        },
        taskId: {
          type: String,
          required: true,
          unique: true,
        },
        status: {
          type: String,
          default: "active",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SnipesTasks", SnipeScheme);
