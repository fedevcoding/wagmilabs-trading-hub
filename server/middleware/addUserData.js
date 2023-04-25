const JWT = require("jsonwebtoken");
require("dotenv").config();

const adduserData = async (req, res, next) => {
  const token = req.header("x-auth-token");
  try {
    const userDetails = await JWT.decode(token, process.env.JWT_PRIVATE_KEY);

    req.userDetails = userDetails;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = adduserData;
