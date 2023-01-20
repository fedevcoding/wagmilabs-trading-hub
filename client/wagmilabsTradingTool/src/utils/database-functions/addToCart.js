import baseUrl from "../../variables/baseUrl"


async function addToCart({name, tokenId, price, image, marketplace, contractAddress}){
    
    try{

        let pushStatus = await fetch(`${baseUrl}/updateUserCart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.jsonwebtoken
            },
            body: JSON.stringify({name, tokenId, price, image, contractAddress, marketplace})
        })
        pushStatus = (await pushStatus.json()).pushStatus
        return pushStatus
    }
    catch(e) {
        console.log(e)
    }
}

export default addToCart