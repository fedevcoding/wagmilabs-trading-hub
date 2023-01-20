const mongoose = require("mongoose")


const MintingSchema = mongoose.Schema({
    contractAddress: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    floor_price: {
        type: Number
    },
    mintVolume: {
        type: Number
    },
    mintPrice: {
        type: Number
    },
    totalMints: {
        type: Number
    },
    creationDate: {
        type: String
    },
    pendingTxs: [String],
    mints: [
        {
            value: {
                type: Number,
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            minterAddress: {
                type: String,
                required: true
            },
            mintTime: {
                type: Number,
                required: true
            }
        }
    ],
}, {
    timestamps: true
})

module.exports = mongoose.model("Minting", MintingSchema)


MintingSchema.index({ 'mints.mintTime': -1 }, { name: "mintTime_index", background: true, unique: false }, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Index created successfully");
    }
});