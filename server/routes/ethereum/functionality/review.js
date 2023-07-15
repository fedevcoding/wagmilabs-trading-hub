const express = require("express");
const { insertStats } = require("../../../utils/utils");

const reviewRoute = express();

reviewRoute.post("/review", async (req, res) => {
  const { review } = req.body;

  if (!review) return res.status(400).json({ message: "No review found" });
  await insertStats({
    address: review,
    extra_data: null,
    ip_address: req.clientIp,
    pass_type: null,
    source: "website",
    timestamp: Date.now(),
    type: "review",
  });
  try {
    res.status(200).send({ message: "Review submitted" });
  } catch (err) {
    res.status(400).send({ message: "Error submitting review" });
  }
});

module.exports = reviewRoute;
