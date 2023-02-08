import baseUrl from "../../variables/baseUrl"


async function getFromServer(url) {
    const apiData = await fetch(`${baseUrl}${url}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.jsonwebtoken,
        },
    })

    if (!apiData.ok) throw new Error("error fetching data")

    const data = await apiData.json()

    return data
}




export { getFromServer }