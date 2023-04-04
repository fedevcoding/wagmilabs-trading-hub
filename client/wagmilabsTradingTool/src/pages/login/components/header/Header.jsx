import React from "react";

import ConnectWallet from "../connect/ConnectWallet";
import { logo } from "src/assets";

import "./style.scss";
import EthereumSearch from "src/pages/search/EthereumSearch";
import Links from "./components/Links";

const Header = ({ setConnected, setWalletConnected, setSignIn }) => {
  return (
    <>
      <header className="login-header">
        <div className="logo-search-container">
          <img className="logo" alt="" src={logo} />

          <EthereumSearch inLogin={true} />
        </div>

        <Links setSignIn={setSignIn} />

        <ConnectWallet
          setConnected={setConnected}
          setWalletConnected={setWalletConnected}
          isHeader={true}
          setSignIn={setSignIn}
        />
      </header>
    </>
  );
};

export default Header;
