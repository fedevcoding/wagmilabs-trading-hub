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
        remaining: {
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
          // unique: true,
        },
        status: {
          type: String,
          default: "active",
        },
      },
    ],
    activities: [
      {
        collectionAddress: {
          type: String,
          required: true,
        },
        collectionName: {
          type: String,
        },
        collectionImage: {
          type: String,
        },
        tokenId: {
          type: String,
          required: true,
        },
        tokenName: {
          type: String,
        },
        tokenImage: {
          type: String,
        },
        buyPrice: {
          type: Number,
          required: true,
        },
        gasPrice: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          required: true,
        },
        taskOwner: {
          type: String,
          required: true,
        },
        walletAddress: {
          type: String,
          required: true,
        },
        taskId: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          required: true,
        },
        eventTimestamp: {
          type: Number,
          required: true,
        },
        transactionHash: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SnipesTasks", SnipeScheme);

SnipeScheme.index(
  { "tasks.taskId": 1 },
  { unique: true, partialFilterExpression: { "tasks.taskId": { $exists: true } } }
);
