const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")
const Personal = require("../../../models/calendars/PersonalModel");
const nullAddress = "0x0000000000000000000000000000000000000000";
const adminAddresses = [
    "0x8d50Ca23bDdFCA6DB5AE6dE31ca0E6A17586E5B8",
    "0xfe697C5527ab86DaA1e4c08286D2bE744a0E321E",
    "0x7FAC7b0161143Acfd80257873FB9cDb3F316C10C",
  ];
const personalRoute = express()

personalRoute.get("/", checkAuth, async (req, res) => {
    const { address } = req.userDetails;

    try {

        const personal = await Personal.find({
            $or: [
                {address: nullAddress},
                {address},
            ]
        });

        if (!personal) throw new Error("Personal not found")

        return res.status(200).json({personal})
    }
    catch (e) {
        return res.status(400).json({ msg: e.message });
    }

})

personalRoute.post('/', checkAuth, async (req, res) => {
    const { address } = req.userDetails;
    const isAdmin = adminAddresses.includes(address);
    const { event } = req.body || {};
    console.log('PARAMS: ',address,isAdmin,event)

    try {
        const personal = await Personal.updateOne({ address: isAdmin ? nullAddress : address }, { $push: { events: {$each: [event], $slice: -150} } }, { upsert: true })
        if (!personal) throw Error('Something went wrong saving the admin personal event');
        
        return res.status(200).json({personal});
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

personalRoute.delete('/', async (req, res) => {

    const { id } = req.body || {};

    try {
        const personal = await Personal.deleteOne({_id: id});
        if (!personal) throw Error('Something went wrong deleting all the personal events');
        return res.status(200).json({personal});
    } catch (e) {
        return res.status(400).json({ msg: e.message });
    }
});


module.exports = personalRoute