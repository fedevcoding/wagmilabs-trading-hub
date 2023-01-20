import baseUrl from "../../variables/baseUrl"


async function emptyCart(){
    try{
        let status = await fetch(`${baseUrl}/emptyCart`, {
            headers: {
                "x-auth-token": localStorage.jsonwebtoken
            }
        })
        status = (await status.json()).status
        return status
    }
    catch(e) {
        console.log(e)
    }
}


export default emptyCart