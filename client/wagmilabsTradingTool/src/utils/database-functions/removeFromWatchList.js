import baseUrl from "../../variables/baseUrl"

async function removeFromWatchList(type, address, setIsWatchList){
    
    console.log(type)
    let bodyData = {
        method: "remove",
        type: type,
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
    setIsWatchList(false)
}

export default removeFromWatchList