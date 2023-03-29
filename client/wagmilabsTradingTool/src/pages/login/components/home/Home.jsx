import React from "react";
import ConnectWallet from "../connect/ConnectWallet";

import { DefaultPlayer as Video } from "react-html5video";
import "react-html5video/dist/styles.css";

import "./style.scss";
import { loginVideo } from "src/assets";
const Home = ({ setWalletConnected }) => {
  return (
    <div className="login-home">
      <div className="title-connect-container">
        <div className="title">
          <h1>Enter the world of Advanced NFT Trading with the fastest platform yet...</h1>
        </div>

        <ConnectWallet setWalletConnected={setWalletConnected} isHeader={false} />
      </div>

      <div className="video-container">
        <Video controls={["PlayPause", "Seek", "Time", "Volume", "Fullscreen"]} playsInline>
          <source src={loginVideo} type="video/webm" />
        </Video>
      </div>
    </div>
  );
};

export default Home;
