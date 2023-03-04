import React, { useState } from "react";
import "./style.scss";

import "@rainbow-me/rainbowkit/styles.css";

import Header from "./components/header/Header";
import SignModal from "./components/signModal/SignModal";
import Home from "./components/home/Home";

import { loginBackground } from "src/assets";
import Footer from "./components/footer/Footer";

const Login = ({ setConnected }) => {
  const [walletConnected, setWalletConnected] = useState(false);

  return (
    <>
      <div className="login-container">
        <img src={loginBackground} className="login-background" alt="login-background"></img>
        <Header setConnected={setConnected} setWalletConnected={setWalletConnected} />

        {walletConnected && <SignModal setConnected={setConnected} setWalletConnected={setWalletConnected} />}

        <Home setWalletConnected={setWalletConnected} />
        {/* <Team /> */}
        <Footer />
      </div>
    </>
  );
};

export default Login;
