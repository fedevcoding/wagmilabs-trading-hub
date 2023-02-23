import React from "react";

import ConnectWallet from "../connect/ConnectWallet";
import { logoBeta } from "src/assets";


import "./style.scss"
import EthereumSearch from "src/pages/search/EthereumSearch";
import Links from "./components/Links";

const Header = ({ setConnected, setWalletConnected }) => {
  return (
    <>
      <header className="login-header">

        <div className="logo-search-container">
          <img className="logo" alt="" src={logoBeta} />

          <EthereumSearch inLogin={true} />
        </div>

        <Links />

        <ConnectWallet
          setConnected={setConnected}
          setWalletConnected={setWalletConnected}
          isHeader={true}
        />
      </header>
    </>
  );
};

export default Header;
