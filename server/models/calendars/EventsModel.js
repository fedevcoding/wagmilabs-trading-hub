const mongoose = require("mongoose")

const EventsSchema = mongoose.Schema({
    timestamp: {
        type: Number
    },
    eventName: {
        type: String
    },
    links: {
        type: Object
    },
    eventDescription: {
        type: String
    },
    eventLocation: {
        type: String
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("Events", EventsSchema)