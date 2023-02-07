require("dotenv").config()

const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY;


const execReservoirApi = async (url) => {
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