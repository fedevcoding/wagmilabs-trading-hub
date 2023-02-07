const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")

const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY

const collectionActivityRoute = express()

collectionActivityRoute.get('/:address', checkAuth, (req, res) => {


    async function getData() {


        try {
            const { address } = req.params
            const { types, continuation: requestContinuation } = req.query

            if (!address) throw new Error("No address provided")

            const filters = getFiltersUrl(types)

            const continuationFilter = requestContinuation ? `&continuation=${requestContinuation}` : ""

            let url = `https://api.reservoir.tools/collections/activity/v5?collection=${address}${filters}${continuationFilter}`

            let data = await fetch(url, {
                headers: {
                    "x-api-key": RESERVOIR_API_KEY
                }
            })
            if (!data.ok) throw new Error("Error fetching data")
            data = await data.json()

            const { continuation, activities } = data

            res.status(200).json({ continuation, activities })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ error: err })
        }
    }
    getData()
})

module.exports = collectionActivityRoute



function getFiltersUrl(types) {

    try {
        const allTypes = "&types=sale&types=ask&types=bid&types=transfer"
        let filters = ""

        if (!types || types === "undefined") types = allTypes
        else {
            types = types.split("-")

            types.forEach(type => {
                filters += `&types=${type}`
            })
        }

        return filters
    }
    catch (e) {
        return ""
    }
}



