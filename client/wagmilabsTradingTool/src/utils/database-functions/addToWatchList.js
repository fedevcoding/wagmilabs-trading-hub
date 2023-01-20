import baseUrl from "../../variables/baseUrl"

async function addToWatchList(type, address, setIsWatchList){
        
    let bodyData = {
        method: "add",
        type,
        collectionAddress: address
    }

    let data = await fetch(`${baseUrl}/updateWatchList`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.jsonwebtoken
        },
        body: JSON.stringify(bodyData)
    })
    setIsWatchList(true)
}

export default addToWatchList