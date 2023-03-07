const express = require("express");
const checkAdmin = require("../../../middleware/checkAdmin");
const checkAuth = require("../../../middleware/checkAuth");
const Personal = require("../../../models/calendars/PersonalModel");
const nullAddress = "0x0000000000000000000000000000000000000000";
const personalRoute = express();

const { lruCache } = require("../../../services/cache/lru");

personalRoute.get("/", checkAuth, checkAdmin, async (req, res) => {
  const ttl = 6 * 60 * 60 * 1000;
  const { address } = req.userDetails;
  const isAdmin = req.isAdmin;

  try {
    if (isAdmin) {
      const personal = await Personal.find({ address: nullAddress });
      if (!personal) throw new Error("Personal not found");
  
      await lruCache(Personal.find({ address: nullAddress }),
      {
        key: `personal`,
        ttl,
      });
      return res.status(200).json({ personal });
    } else {
      const personal = await Personal.find({
        $or: [{ address: nullAddress }, { address }],
      });
      if (!personal) throw new Error("Personal not found");
  
      await lruCache(Personal.find({
        $or: [{ address: nullAddress }, { address }],
      }), {
        key: `personal`,
        ttl,
      });
      return res.status(200).json({ personal });
    }
  } catch (e) {
    return res.status(400).json({ msg: e.message });
  }
});

personalRoute.post("/", checkAuth, checkAdmin, async (req, res) => {
  const { address } = req.userDetails;
  const isAdmin = req.isAdmin;
  const { event } = req.body || {};

  try {
    const personal = await Personal.updateOne(
      { address: isAdmin ? nullAddress : address },
      { $push: { events: { $each: [event], $slice: -150 } } },
      { upsert: true }
    );
    if (!personal)
      throw Error("Something went wrong saving the admin personal event");

    return res.status(200).json({ personal });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

personalRoute.delete("/", checkAuth, checkAdmin, async (req, res) => {
  const { address } = req.userDetails;
  const isAdmin = req.isAdmin;

  const { id } = req.body || {};

  try {
      if (isAdmin) {
        const personal = await Personal.findOneAndUpdate(
          { address: nullAddress },
          {
            $pull: {
              events: { _id: id },
            },
          }
        );
      if (!personal)
        throw Error("Something went wrong deleting all the personal events");
      return res.status(200).json({ personal });
      } else {
        const match = await Personal.findOne({_id: id});
        if (match && match._id === address) {
          const personal = await Personal.findOneAndUpdate(
            { address: address },
            {
              $pull: {
                events: { _id: id },
              },
            }
          );
          if (!personal)
          throw Error("Something went wrong deleting all the personal events");
          return res.status(200).json({ personal });
        } 
      }
  } catch (e) {
    return res.status(400).json({ msg: e.message });
  }
});

module.exports = personalRoute;
