import React, { useEffect } from "react";
import { baseUrl } from "@Variables";
import { useNavigate } from "react-router-dom";

const RefreshToken = ({ connected, setConnected }) => {
  const navigate = useNavigate();

  async function refreshToken() {
    try {
      let result = await fetch(`${baseUrl}/refresh`, {
        credentials: "include",
      });
      if (!result.ok) throw new Error("error");

      result = await result.json();

      if (result.authenticated) {
        localStorage.setItem("jsonwebtoken", result.token);
      } else {
        navigate("/");
        localStorage.removeItem("jsonwebtoken");
        setConnected(false);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    refreshToken();
    const intervalId = setInterval(refreshToken, 20000);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  return <></>;
};

export default RefreshToken;
