const baseUrl = require("../../variables/baseUrl")


async function updateSnipeTasks(type, taskInfo){
    try{
        let response = await fetch(`${baseUrl}/salesBot`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.jsonwebtoken
            },
            body: JSON.stringify({taskInfo, type})
        })
        
        response = await response.json()

        console.log(response)
    }
    catch(e){
        console.log(e)
    }
}

export default updateSnipeTasks