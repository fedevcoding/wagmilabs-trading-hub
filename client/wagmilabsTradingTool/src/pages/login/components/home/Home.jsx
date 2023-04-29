import React from "react";
import ConnectWallet from "../connect/ConnectWallet";
import { videoThumbnail, preview } from "@Assets";

import { DefaultPlayer as Video } from "react-html5video";
import "react-html5video/dist/styles.css";

import "./style.scss";
const Home = ({ setWalletConnected, setSignIn }) => {
  return (
    <div className="login-home">
      <div className="title-connect-container">
        <div className="title">
          <h1>Enter the world of Advanced NFT Trading with the fastest platform yet FOR FREE...</h1>
        </div>

        <ConnectWallet setWalletConnected={setWalletConnected} isHeader={false} setSignIn={setSignIn} />
      </div>

      <div className="video-container">
        <Video controls={["PlayPause", "Seek", "Time", "Volume", "Fullscreen"]} playsInline poster={videoThumbnail}>
          <source src={preview} type="video/webm" />
        </Video>
      </div>
    </div>
  );
};

export default Home;
