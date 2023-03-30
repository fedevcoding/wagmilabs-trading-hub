const { adminAddresses } = require("../config/adminAddresses");

require("dotenv").config();

const checkAdmin = async (req, res, next) => {
  try {
    const { address } = req.userDetails;

    const isAdmin = adminAddresses.map(list => list.toLowerCase()).includes(address.toLowerCase());

    req.isAdmin = isAdmin;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = checkAdmin;
