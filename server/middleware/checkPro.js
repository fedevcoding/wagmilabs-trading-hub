require("dotenv").config();

const checkPro = async (req, res, next) => {
  try {
    const { passType } = req.userDetails;

    if (passType === 0 || passType === 2) {
      next();
    } else {
      res.status(400).json({ message: "Invalid pass type" });
    }
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = checkPro;
