const express = require("express");
const checkAdmin = require("../../../middleware/checkAdmin");
const checkAuth = require("../../../middleware/checkAuth");
const Personal = require("../../../models/calendars/PersonalModel");
const nullAddress = "0x0000000000000000000000000000000000000000";
const personalRoute = express();

const manageEvents = async (address, Collection, isAdmin) => {
  const res = await (isAdmin
    ? Collection.find({ address: nullAddress })
    : Collection.find({ $or: [{ address: nullAddress }, { address }] }));
  return res;
};

personalRoute.get("/", checkAuth, checkAdmin, async (req, res) => {
  const { address } = req.userDetails;
  const isAdmin = req.isAdmin;

  try {
    if (isAdmin) {
      const personal = await manageEvents(address, Personal, true);
      if (!personal) throw new Error("Personal not found");

      return res.status(200).json({ personal });
    } else {
      const personal = await manageEvents(address, Personal, false);
      if (!personal) throw new Error("Personal not found");

      return res.status(200).json({ personal });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ msg: e.message });
  }
});

personalRoute.post("/", checkAuth, checkAdmin, async (req, res) => {
  const { address } = req.userDetails;
  const isAdmin = req.isAdmin;
  let { event: evnt } = req.body || {};
  const event = isAdmin ? { ...evnt, isAdmin: true } : evnt;

  try {
    const personal = await Personal.updateOne(
      { address: isAdmin ? nullAddress : address },
      { $push: { events: { $each: [event], $slice: -150 } } },
      { upsert: true }
    );
    if (!personal) throw Error("Something went wrong saving the admin personal event");
    if (isAdmin) {
      await manageEvents(address, Personal, true);
    } else {
      await manageEvents(address, Personal, false);
    }
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
      if (!personal) throw Error("Something went wrong deleting all the personal events");
      await manageEvents(address, Personal, true);
      return res.status(200).json({ personal });
    } else {
      const personal = await Personal.findOneAndUpdate(
        { address: address },
        {
          $pull: {
            events: { _id: id },
          },
        }
      );
      if (!personal) throw Error("Something went wrong deleting all the personal events");
      await manageEvents(address, Personal, false);
      return res.status(200).json({ personal });
    }
  } catch (e) {
    return res.status(400).json({ msg: e.message });
  }
});

module.exports = personalRoute;
