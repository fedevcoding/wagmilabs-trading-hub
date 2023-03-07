const mongoose = require("mongoose")

const PersonalSchema = mongoose.Schema({
    address: {
        type: String,
        unique: true,
    },
    events: [
        {
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
            isAdmin: {
                type: Boolean
            },
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model("Personal", PersonalSchema)