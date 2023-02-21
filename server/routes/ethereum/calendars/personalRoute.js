const express = require("express")
const Personal = require("../../../models/calendars/PersonalModel")

const personalRoute = express()

personalRoute.get("/", async (req, res) => {

    try {

        const personal = await Personal.find({});;

        if (!personal) throw new Error("Personal not found")

        res.status(200).json({personal})
    }
    catch (e) {
        res.status(400).json({ error: e, status: "error" })
    }

})


module.exports = personalRoute