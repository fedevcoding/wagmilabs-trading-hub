import baseUrl from "../../variables/baseUrl"


async function emptyCart() {
    try {
        let res = await fetch(`${baseUrl}/emptyCart`, {
            headers: {
                "x-auth-token": localStorage.jsonwebtoken
            }
        })
        if (!res.ok) throw new Error("error")
        res = await res.json()
        const { status } = res
        return status
    }
    catch (e) {
        console.log(e)
        return "error"
    }
}


export default emptyCart