import React from "react";
import wagmiLogo from "../../assets/logo.png";
import baseUrl from "../../variables/baseUrl";

const CheckingHeader = () => {
  async function logOut() {
    try {
      let result = await fetch(`${baseUrl}/removeRefreshToken`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.jsonwebtoken,
        },
        credentials: "include",
      });
      if (result.ok) {
        localStorage.removeItem("jsonwebtoken");
        window.location.href = "/";
      }
    } catch (e) {}
  }

  return (
    <>
      <div>
        <header className="header">
          <img className="wagmi-title" alt="" src={wagmiLogo} />
          <h1 className="header-title">Wagmi Labs Trading Hub</h1>

          <div className="log-out-checking" onClick={logOut}>
            Log Out
          </div>
        </header>
      </div>
    </>
  );
};

export default CheckingHeader;
