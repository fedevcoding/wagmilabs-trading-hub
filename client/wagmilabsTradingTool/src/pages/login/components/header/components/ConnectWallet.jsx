import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const iconsMapping = value => {
  switch (value) {
    case "trends":
      return <i className="fa-solid fa-fire"></i>;
    case "mints":
      return <i className="fa-solid fa-compass"></i>;
    case "bots":
      return <i className="fa-solid fa-robot"></i>;
    case "volumes":
      return <i className="fa-regular fa-chart-simple"></i>;
    case "pnl":
      return <i className="fa-brands fa-ethereum"></i>;
    case "feed":
      return <i className="fa-regular fa-newspaper"></i>;
    default:
      return;
  }
};

const ConnectWallet = ({ value, text }) => {
  return (
    <ConnectButton.Custom>
      {({ openConnectModal }) => {
        return (
          <div onClick={openConnectModal}>
            {iconsMapping(value)}
            <p>{text}</p>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWallet;
