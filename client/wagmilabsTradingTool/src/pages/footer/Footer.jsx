import React, { useContext, useState } from "react";
import { GasModal, LivePulsing } from "@Components";
import "./Footer.css";

import { UserDataContext } from "../../context/userContext";

const Footer = () => {
  const { gasSettings, ethData } = useContext(UserDataContext);

  const [gasModalOpen, setGasModalOpen] = useState(false);

  const currentBlock = ethData?.currentBlockNumber || 0;
  let blockGas = 0;
  if (ethData?.blockPrices) {
    blockGas = Math.round(ethData?.blockPrices[0].baseFeePerGas);
  }

  const openGasSettings = () => {
    if (!gasModalOpen) {
      setGasModalOpen(true);
    }
  };

  return (
    <footer className="global-footer">
      <div className="footer-eth-settings">
        <div className="footer-gas-preset" onClick={openGasSettings}>
          <i className="fa-solid fa-bolt-lightning"></i>
          <p>Preset: {gasSettings.label}</p>
          <GasModal
            setGasModalOpen={setGasModalOpen}
            gasModalOpen={gasModalOpen}
          />
        </div>

        <a
          className="footer-blocks-mined"
          href={`https://etherscan.io/block/${currentBlock}`}
          target="_blank"
          rel="noreferrer"
        >
          <i className="fa-duotone fa-cube"></i>
          <p>{currentBlock}</p>
        </a>

        <a
          className="footer-gas-preset"
          href="https://etherscan.io/gastracker"
          target={"_blank"}
          rel="noreferrer"
        >
          <i className="fa-solid fa-gas-pump"></i>
          <p>{blockGas}</p>
        </a>

        <a
          className="footer-gas-preset"
          href="https://tradingview.com/chart/?symbol=COINBASE%3AETHUSD"
          target={"_blank"}
          rel="noreferrer"
        >
          <i className="fa-brands fa-ethereum"></i>
          <p>${ethData?.ethPrice}</p>
        </a>
        <LivePulsing />
      </div>

      <div className="footer-links">
        <a href="/legal" target={"_blank"}>
          <i className="fa-solid fa-scale-unbalanced"></i>
        </a>

        <a href="#info" target={"_blank"}>
          <i className="fa-regular fa-circle-info"></i>
        </a>

        <a
          href="https://discord.gg/wagmilabs"
          target={"_blank"}
          rel="noreferrer"
        >
          <i className="fa-brands fa-discord"></i>
        </a>

        <a
          href="https://twitter.com/wagmi_labs"
          target={"_blank"}
          rel="noreferrer"
        >
          <i className="fa-brands fa-twitter"></i>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
