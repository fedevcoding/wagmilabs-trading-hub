import baseUrl from "../../variables/baseUrl";
import { disconnect } from "@wagmi/core";

async function logOut() {
  console.log("logging out");
  let result = await fetch(`${baseUrl}/removeRefreshToken`, {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.jsonwebtoken,
    },
    credentials: "include",
  });
  result = await result.json();
  if (result.ok) {
    await disconnect();
    localStorage.removeItem("jsonwebtoken");
    localStorage.removeItem("loggedIn");
    // navigate("/")
    window.location.href = "/";
  }
}

export default logOut;
