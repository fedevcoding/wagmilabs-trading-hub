import React, { useEffect, useState } from "react";
import "./style.scss";

import "@rainbow-me/rainbowkit/styles.css";

import Header from "./components/header/Header";
import SignModal from "./components/signModal/SignModal";
import Home from "./components/home/Home";

import { loginBackground } from "src/assets";
import Footer from "./components/footer/Footer";
import { Reviews } from "./components/reviews/Reviews.jsx";
import { Comparison } from "./components/comparison/Comparison";
import Plans from "./components/plans/Plans";
import Partners from "./components/partners/Partners";

const Login = ({ setConnected, plans }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [signIn, setSignIn] = useState(false);

  const goToPlans = () => {
    setSignIn(false);
    const planSection = document.querySelector(".plans-section");
    planSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (plans) {
      goToPlans();
    }
  }, [plans]);

  return (
    <>
      <div className="login-container">
        <div className="section1">
          <img src={loginBackground} className="login-background" alt="login-background"></img>
          <Header setConnected={setConnected} setWalletConnected={setWalletConnected} setSignIn={setSignIn} />
          {walletConnected && signIn && <SignModal setConnected={setConnected} setSignIn={setSignIn} />}
          <Home setWalletConnected={setWalletConnected} setSignIn={setSignIn} />
        </div>
        <div className="section2">
          <hr className="hr"></hr>
          <Plans plans={plans} />
          <hr className="hr"></hr>
          <Reviews />
          <Partners />
          <Comparison />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Login;
