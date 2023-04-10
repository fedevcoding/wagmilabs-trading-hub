const mongoose = require("mongoose");

const FreeTrialsSchema = mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    expiration: {
      type: String,
      required: true,
      immutable: true,
    },
    fromCatchMint: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

// cartSchema.index({ "tokenId": 1, "contractAddress": 1 }, { unique: true })

module.exports = mongoose.model("FreeTrials", FreeTrialsSchema);
