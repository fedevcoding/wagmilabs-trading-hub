const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")

const refreshCollectionRoute = express()


const RESERVOIR_API_KEY = process.env.RESERVOIR_API
refreshCollectionRoute.get('/:address', checkAuth, (req, res) => {

    async function refreshMetadata() {
        try {
            const { address } = req.params

            if (!address) return res.status(400).json({ status: "error", ok: false, message: "Address is required" })

            const options = {
                method: 'POST',
                headers: {accept: '*/*', 'content-type': 'application/json', 'x-api-key': RESERVOIR_API_KEY},
                body: JSON.stringify({overrideCoolDown: false, metadataOnly: false, collection: address})
            };
            
            const response = await fetch('https://api.reservoir.tools/collections/refresh/v1', options)

            res.status(200).json({ response })
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ error: e })
        }

    }
    refreshMetadata()
})

module.exports = refreshCollectionRoute
