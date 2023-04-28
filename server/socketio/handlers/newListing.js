const { socketIo } = require("../../server");

function newListing(listingData) {
  try {
    const contractAddress = listingData?.contractAddress?.toLowerCase();
    const channel = `listings${contractAddress}`;
    socketIo.sockets.to(channel).emit("listing", listingData);
  } catch (e) {
    console.log(e);
  }
}

module.exports = newListing;
