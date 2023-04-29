require("dotenv").config();

const checkTrendingPro = async (req, res, next) => {
  try {
    const { passType } = req.userDetails;
    const { time } = req.params;
    const userTime = parseInt(time);

    if (userTime <= 1800000) {
      if (passType === 0 || passType === 2 || passType === 4) next();
      else {
        res.status(400).json({ message: "Invalid pass type" });
        return false;
      }
    } else next();
  } catch (err) {
    res.status(400).json({ message: "Invalid data" });
  }
};

module.exports = checkTrendingPro;
