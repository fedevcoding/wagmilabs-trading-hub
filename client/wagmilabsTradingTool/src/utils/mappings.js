const marketplaceFeeMapping = {
  opensea: 2.5,
  looksrare: 2.5,
  x2y2: 2.5,
};

const marketListingMapping = {
  opensea: {
    orderbook: "opensea",
    orderKind: "seaport",
  },
  x2y2: {
    orderbook: "x2y2",
    orderKind: "x2y2",
  },
  looksrare: {
    orderbook: "looks-rare",
    orderKind: "looks-rare",
  },
};

module.exports = {
  marketplaceFeeMapping,
  marketListingMapping,
};
