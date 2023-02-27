require("dotenv").config()

const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY;
const CUSROM_RESERVOIR_KEY = process.env.CUSTOM_RESERVOIR_KEY;


const execReservoirApi = async (url, customApi) => {
    let apiKey = RESERVOIR_API_KEY;
    if(customApi) apiKey = CUSROM_RESERVOIR_KEY;
    
    let result = await fetch(url, {
        headers: {
            'x-api-key': apiKey
        }
    })

    result = await result.json();
    return result;
};

module.exports = {
    execReservoirApi,
};