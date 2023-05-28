import ConnectWallet from "./ConnectWallet";
import React from "react";

const links = {
  trends: "Trends",
  mints: "Mints",
  bots: "Bots",
  volumes: "Volumes",
  pnl: "P&L",
  feed: "Feed",
};

const Links = ({ setSignIn }) => {
  return (
    <div className="links-container">
      {Object.keys(links).map(key => {
        const text = links[key];
        return <ConnectWallet text={text} value={key} key={key} setSignIn={setSignIn} />;
      })}
    </div>
  );
};

export default Links;
