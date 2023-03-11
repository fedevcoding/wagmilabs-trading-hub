const mongoose = require("mongoose")

const SpacesSchema = mongoose.Schema({
    timestamp: {
        type: Number
    },
    spaceName: {
        type: String
    },
    links: {
        type: Object
    },
    spaceDescription: {
        type: String
    },
    spaceHost: {
        type: String
    },

}, {
    timestamps: true
})

module.exports = mongoose.model("Spaces", SpacesSchema)