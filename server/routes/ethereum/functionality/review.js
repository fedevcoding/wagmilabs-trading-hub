const express = require("express");
const { insertStats } = require("../../../utils/utils");

const reviewRoute = express();

reviewRoute.post("/review", async (req, res) => {
  const { review } = req.body;

  if (!review) return res.status(400).json({ message: "No review found" });
  await insertStats({
    address: null,
    extra_data: review,
    ip_address: req.clientIp,
    pass_type: null,
    source: "website",
    timestamp: Date.now(),
    type: "review",
  });
  try {
    res.status(200);
  } catch (err) {
    res.status(400);
  }
});

module.exports = reviewRoute;
