import { baseUrl } from "@Variables";

async function updateSnipeTasks(type, taskInfo) {
  try {
    let response = await fetch(`${baseUrl}/salesBot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.jsonwebtoken,
      },
      body: JSON.stringify({ taskInfo, type }),
    });

    // eslint-disable-next-line no-unused-vars
    response = await response.json();
  } catch (e) {
    console.log(e);
  }
}

export default updateSnipeTasks;
