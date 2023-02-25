require("dotenv").config()

const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY;
const CUSTOM_API = process.env.CUSTOM_RESERVOIR_API

const execReservoirApi = async (url, custom) => {
    let apiKey = RESERVOIR_API_KEY
    if(custom) apiKey = CUSTOM_API
    let result = await fetch(url, {
        headers: {
            'x-api-key': RESERVOIR_API_KEY
        }
    })

    result = await result.json();
    return result;
};

module.exports = {
    execReservoirApi,
};