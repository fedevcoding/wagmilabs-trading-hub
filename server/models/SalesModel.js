const mongoose = require("mongoose")

const SalesSchema = mongoose.Schema({
    contractAddress: {
        type: String,
        required: true,
        unique: true,
    },
    sales: {
        type: Array,
        tokenId: {
            type: Number,
            required: true,
        },
        transactionHash: {
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
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("Sales", SalesSchema)


SalesSchema.index({ 'sales.timestamp': -1 }, { name: "timestamp_index", background: true, unique: false }, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Index created successfully");
    }
});