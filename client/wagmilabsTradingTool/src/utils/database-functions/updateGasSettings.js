import baseUrl from "../../variables/baseUrl";

async function updateGasSettings(newGasSetting) {
  try {
    let res = await fetch(`${baseUrl}/updateGasSettings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.jsonwebtoken,
      },
      body: JSON.stringify(newGasSetting),
    });

    res = await res.json();
    const { success: result } = res;
    return result;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export default updateGasSettings;
