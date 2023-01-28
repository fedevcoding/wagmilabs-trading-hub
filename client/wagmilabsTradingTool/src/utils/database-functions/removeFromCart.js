import baseUrl from "../../variables/baseUrl"


async function removeFromCart(tokenId, contractAddress){
    try{
        let pushStatus = await fetch(`${baseUrl}/updateUserCart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.jsonwebtoken
            },
            body: JSON.stringify({tokenId, contractAddress, type: "remove"})
        })
        pushStatus = (await pushStatus.json()).pushStatus
        return pushStatus
    }
    catch(e) {
        console.log(e)
    }
}

export default removeFromCart