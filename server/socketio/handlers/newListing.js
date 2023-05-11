const { getSocket } = require("../../server");

function newListing(listingData) {
  try {
    const socketIo = getSocket();
    const contractAddress = listingData?.contractAddress?.toLowerCase();
    const channel = `listings:${contractAddress}`;
    socketIo.sockets.to(channel).emit("listing", listingData);
  } catch (e) {
    console.log(e);
  }
}

function handleListingSocket(socket) {
  socket.on("joinListings", collectionAddress => {
    const channel = `listings:${collectionAddress}`;
    socket.join(channel);
  });

  socket.on("leaveListings", collectionAddress => {
    const channel = `listings:${collectionAddress}`;
    socket.leave(channel);
  });
}

module.exports = { newListing, handleListingSocket };
