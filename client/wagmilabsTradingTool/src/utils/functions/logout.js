import { baseUrl } from "@Variables";

async function logOut(setConnected) {

  try{
    let result = await fetch(`${baseUrl}/removeRefreshToken`, {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.jsonwebtoken,
      },
      credentials: "include",
    });
    result = await result.json();
    if (result.ok) {
      setConnected(false)
      document.body.style.background = "linear-gradient(to right, #3494E6, #EC6EAD)";
      localStorage.removeItem("jsonwebtoken");
    }
  }
  catch(e){

  }
}

export default logOut;
