const mongoose = require("mongoose");

const MarketplacesSchema = mongoose.Schema(
  {
    marketplace: {
      type: String,
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    eth_volume: {
      type: Number,
      required: true,
    },
    dollar_volume: {
      type: Number,
      required: true,
    },
    count_sales: {
      type: Number,
      required: true,
    },
    active_traders: {
      type: Number,
      required: true,
    },
    count_eth_sales: {
      type: Number,
      required: true,
    },
    count_weth_sales: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Marketplaces", MarketplacesSchema);

MarketplacesSchema.index({ marketplace: 1, day: 1 }, { unique: true });
