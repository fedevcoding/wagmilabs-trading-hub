const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")


const collectionActivityRoute = express()

collectionActivityRoute.get('/:address', checkAuth, (req, res) => {

    const {address} = req.params
    const {types} = req.query


    const filters = getFiltersUrl(types)
    console.log(filters)


    async function getData(){
        try{
            let url = `https://api.reservoir.tools/collections/activity/v5?collection=${address}${filters}`

            let data = await fetch(url, {
                headers: {
                    "x-api-key": '9a16bf8e-ec68-5d88-a7a5-a24044de3f38'
                }
            })
            data = (await data.json()).activities

            res.json(data)
        }
        catch(err){
            console.log(err)
        }
    }
    getData()
})

module.exports = collectionActivityRoute



function getFiltersUrl(types){
    const allTypes = "&types=sale&types=ask&types=bid&types=transfer"
    let filters = ""

    if(!types || types === "undefined") types = allTypes
    else{
        types = types.split("-")
    
        types.forEach(type => {
            filters += `&types=${type}`
        })
    }

    return filters
}



