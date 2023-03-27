import React, { useState } from "react";
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

const Login = ({ setConnected }) => {
  const [walletConnected, setWalletConnected] = useState(false);

  return (
    <>
      <div className="login-container">
        <div className="section1">
          <img src={loginBackground} className="login-background" alt="login-background"></img>
          <Header setConnected={setConnected} setWalletConnected={setWalletConnected} />
          {walletConnected && <SignModal setConnected={setConnected} setWalletConnected={setWalletConnected} />}
          <Home setWalletConnected={setWalletConnected} />
        </div>
        <div className="section2">
          <hr className="hr"></hr>
          <Plans />
          <Reviews />
          <Comparison />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Login;
