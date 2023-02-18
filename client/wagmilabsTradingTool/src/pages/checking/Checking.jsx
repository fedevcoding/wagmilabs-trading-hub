import React, { useEffect } from "react";
import { baseUrl } from "@Variables";
import animationBlack from "./animationblack.json";
import Lottie from "react-lottie-player";
import "./checking.css";

const Checking = ({ setConnected, setChecking }) => {
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    async function verify() {
      try {
        let res = await fetch(`${baseUrl}/refresh`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("error");

        res = await res.json();

        // await delay(1650);
        if (!res.authenticated) {
          localStorage.removeItem("jsonwebtoken");

          window.location.href = "/";
          setConnected(false);
        } else {
          const { token } = res;

          if (!token) throw new Error("error");

          localStorage.setItem("jsonwebtoken", token);

          setConnected(true);
          setChecking(false);
        }
      } catch (e) {
        localStorage.removeItem("jsonwebtoken");

        window.location.href = "/";
        setConnected(false);
      }
    }
    setTimeout(verify, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="checking-text" style={{ backgroundColor: "black" }}>
      <Lottie
        loop
        animationData={animationBlack}
        play
        style={{ width: "20vw", margin: "auto" }}
      />
    </div>
  );
};

export default Checking;
