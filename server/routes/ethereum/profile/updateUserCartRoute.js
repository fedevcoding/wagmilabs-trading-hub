const express = require("express");
const User = require("../../../models/userModel.js");
const checkAuth = require("../../../middleware/checkAuth");

const updateUserCartRoute = express();

updateUserCartRoute.post("/", checkAuth, async (req, res) => {
  try {
    const { type } = req.body;
    const { address } = req.userDetails;

    const user = await User.findOne({ address });

    if (!user) return res.status(404).json({ pushStatus: "error" });

    if (type === "add") {
      const { name, tokenId, price, image, contractAddress, marketplace, collectionName, listingId } = req.body;

      const filteredItems = [
        ...user.shoppingCart,
        {
          name,
          tokenId,
          price,
          image,
          contractAddress,
          collectionName,
          marketplace,
          listingId,
        },
      ];

      user.shoppingCart = filteredItems;
      await user.save();

      res.json({ filteredItems, pushStatus: "success" });
    } else if (type === "remove") {
      const { contractAddress, tokenId, listingId } = req.body;

      let filteredItems;
      if (listingId) {
        filteredItems = user.shoppingCart.filter(item => item.listingId?.toLowerCase() !== listingId?.toLowerCase());
      } else {
        filteredItems = user.shoppingCart.filter(
          item => item.contractAddress + item.tokenId !== contractAddress + tokenId
        );
      }

      user.shoppingCart = filteredItems;
      await user.save();

      res.json({ pushStatus: "success", filteredItems });
    }
  } catch (e) {
    res.status(500).json({ pushStatus: "error" });
    console.log(e);
  }
});

module.exports = updateUserCartRoute;
