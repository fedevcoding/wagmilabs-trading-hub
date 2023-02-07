import baseUrl from "../../variables/baseUrl"

async function removeFromWatchList(address) {

    try {
        let res = await fetch(`${baseUrl}/updateWatchList?method=remove&collectionAddress=${address}`, {
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.jsonwebtoken
            },
        })

        if (!res.ok) {
            throw new Error("Error removing from watchlist")
        }

        return true
    }
    catch (e) {
        return false
    }
}

export default removeFromWatchList