import baseUrl from "../../variables/baseUrl"

async function updateGasSettings(newGasSetting){

    let data = await fetch(`${baseUrl}/updateGasSettings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.jsonwebtoken
        },
        body: JSON.stringify(newGasSetting)
    })

    const result = (await data.json()).success

    if(result){
        return true
    }
    
}

export default updateGasSettings