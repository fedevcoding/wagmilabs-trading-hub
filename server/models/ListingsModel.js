const mongoose = require("mongoose")

const ListingsSchema = mongoose.Schema({
    contractAddress: {
        type: String,
        required: true,
    },
    tokenId: {
        type: Number,
        required: true,
    },
    orderHash: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Number,
        required: true,
    },
    marketplace: {
        type: String,
    },
    value: {
        type: Number,
    },
    name: {
        type: String,
    },
    image: {
        type: String,
    }


}, {
    timestamps: true
})

module.exports = mongoose.model("Listings", ListingsSchema)


ListingsSchema.index({ 'timestamp': -1 }, { name: "timestamp_index", background: true, unique: false }, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Index created successfully");
    }
});