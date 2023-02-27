const express = require('express');
const checkAuth = require('../../middleware/checkAuth');

const statsRoute = express()

const Stats = require("../../models/StatsModel");

statsRoute.post('/', checkAuth, async (req, res) => {

    const { type, timestamp, address } = req.body || {};

    try {
        const stats = await Stats.create({ type, timestamp, address })
        if (!stats) throw Error('Something went wrong saving the stats');
        res.status(200).json({})
    } catch (e) {
        console.log(e)
        res.status(400).json({ msg: e.message });
    }
}
);

module.exports = statsRoute;