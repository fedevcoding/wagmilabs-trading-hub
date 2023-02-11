import React, { useContext, useEffect, useState } from "react";

import "./walletModal.css";

import { UserDataContext } from "../../context/userContext";
import { useAccount } from "wagmi";
import {
  formatAddress,
  getFiatPrice,
  roundPrice,
} from "../../utils/formats/formats";

import ethereumImage from "../../assets/eth.svg";
import usdcImage from "../../assets/usdc.svg";
import usdtImage from "../../assets/usdt.svg";
import wrappedEthereumImage from "../../assets/weth.svg";

import logOut from "../../utils/functions/logout";
import { Button, Tooltip } from "@chakra-ui/react";
import LivePulsing from "./LivePulsing";

// uniswap widget
import copy from "copy-to-clipboard";
import { SwapWidget } from "@uniswap/widgets";
import "@uniswap/widgets/fonts.css";
import { ETHEREUM_NETWORK } from "../../variables/rpcNodes";

const jsonRpcUrlMap = {
  1: [ETHEREUM_NETWORK],
};

console.warn = function () {};

const theme = {
  primary: "#1F4A05",
  secondary: "#5F7D52",
  interactive: "#CBD6BA",
  container: "#D9ECD9",
  module: "#E9F7DF",
  accent: "#8E8B78",
  outline: "#CADDC2",
  dialog: "#FFF",
  fontFamily: "Poppins",
  borderRadius: 0.8,
};

const WalletModal = ({ walletModalOpen, closeWalletModal }) => {
  const [provider, setProvider] = useState();
  const [swapModal, setSwapModal] = useState(false);

  const [copyState, setCopyState] = useState("Copy");

  const { address, connector } = useAccount();
  const { ens, userBalances, profileImage, cryptoPrices } =
    useContext(UserDataContext);

  useEffect(() => {
    getProvider();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (walletModalOpen) {
      setTimeout(() => {
        const modal = document.querySelector(".wallet-modal-container");
        modal.classList.add("visible");
      }, 10);
    }
  }, [walletModalOpen]);

  function totalBalance() {
    const usd1 = getFiatPrice(userBalances.eth, cryptoPrices.ethPrice);
    const usd2 = getFiatPrice(userBalances.weth, cryptoPrices.ethPrice);
    const usd3 = getFiatPrice(userBalances.usdc, cryptoPrices.usdcPrice);
    const usd4 = getFiatPrice(userBalances.usdt, cryptoPrices.usdtPrice);

    const totalBalance = Math.round((usd1 + usd2 + usd3 + usd4) * 100) / 100;
    return totalBalance || "";
  }

  async function getProvider() {
    const currentProvider = await connector?.getProvider();
    currentProvider ? setProvider(currentProvider) : setProvider(null);
  }

  const closeSwapModal = e => {
    if (e.target !== e.currentTarget) return;
    setSwapModal(false);
  };

  const openSwapModal = () => {
    setSwapModal(true);
  };

  const handleCopy = text => {
    copy(text);

    setCopyState("Copied!");

    setTimeout(() => {
      setCopyState("Copy");
    }, 1000);
  };

  return (
    <>
      {walletModalOpen && (
        <div onClick={closeWalletModal} className="wallet-modal-overlay">
          {swapModal && (
            <div className="wallet-swap-overlay" onClick={closeSwapModal}>
              <div className="wallet-swap-container" onClick={closeSwapModal}>
                <SwapWidget
                  width={"550px"}
                  theme={theme}
                  provider={provider}
                  jsonRpcUrlMap={jsonRpcUrlMap}
                />
              </div>
            </div>
          )}
          <div className="wallet-modal-container">
            <header className="wallet-modal-header">
              <div className="wallet-modal-address-container">
                <img src={profileImage} alt=""></img>

                <div>
                  <a
                    href={`https://etherscan.io/address/${address}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <p>{formatAddress(address)}</p>
                  </a>

                  <Tooltip
                    closeOnClick={false}
                    hasArrow
                    label={copyState}
                    fontSize="xs"
                    bg="black"
                    color={"white"}
                    placement="top"
                    borderRadius={"7px"}
                  >
                    <p
                      className="wallet-modal-ens-name"
                      onClick={() => handleCopy(ens)}
                    >
                      {ens}
                    </p>
                  </Tooltip>
                </div>
              </div>

              <div className="wallet-modal-logout-container" onClick={logOut}>
                <p>Log out</p>
                <i className="fa-solid fa-right-from-bracket"></i>
              </div>
            </header>
            <hr className="wallet-modal-hr" />

            <div className="wallet-modal-total-balance-container">
              <p className="wallet-modal-total-balance-text">Total balance</p>
              <p className="wallet-modal-total-balance-value">
                ${totalBalance()} <LivePulsing></LivePulsing>
              </p>
            </div>
            <Button
              colorScheme={"blue"}
              className="wallet-modal-add-funds-button"
              height="50px"
              display={"block"}
              borderTopLeftRadius={0}
              borderTopRightRadius={0}
            >
              Add funds
            </Button>

            <div className="wallet-modal-currency-container">
              <div className="wallet-modal-currency-details">
                <div className="wallet-modal-currency-name">
                  <img src={ethereumImage} alt="" />
                  <p>Ethereum</p>
                </div>

                <div className="wallet-modal-crypto-fiat">
                  <p>
                    {userBalances?.eth ? roundPrice(userBalances.eth) : "0"}
                  </p>
                  <p className="wallet-modal-usd-currency">
                    $
                    {userBalances?.eth
                      ? getFiatPrice(userBalances.eth, cryptoPrices.ethPrice)
                      : "0"}
                  </p>
                </div>
              </div>
              <hr className="wallet-modal-hr-2"></hr>

              <div className="wallet-modal-currency-details">
                <div className="wallet-modal-currency-name">
                  <img src={wrappedEthereumImage} alt="" />
                  <p>Wrapped ethereum</p>
                </div>

                <div className="wallet-modal-crypto-fiat">
                  <p>
                    {userBalances?.weth ? roundPrice(userBalances.weth) : "0"}
                  </p>
                  <p className="wallet-modal-usd-currency">
                    $
                    {userBalances?.weth
                      ? getFiatPrice(userBalances.weth, cryptoPrices.ethPrice)
                      : "0"}
                  </p>
                </div>
              </div>
              <hr className="wallet-modal-hr-2"></hr>

              <div className="wallet-modal-currency-details">
                <div className="wallet-modal-currency-name">
                  <img src={usdcImage} alt="" />
                  <p>USDC</p>
                </div>

                <div className="wallet-modal-crypto-fiat">
                  <p>
                    {userBalances?.usdc ? roundPrice(userBalances.usdc) : "0"}
                  </p>
                  <p className="wallet-modal-usd-currency">
                    $
                    {userBalances?.usdc
                      ? getFiatPrice(userBalances.usdc, cryptoPrices.usdcPrice)
                      : "0"}
                  </p>
                </div>
              </div>
              <hr className="wallet-modal-hr-2"></hr>

              <div className="wallet-modal-currency-details">
                <div className="wallet-modal-currency-name">
                  <img src={usdtImage} alt="" />
                  <p>USDT</p>
                </div>

                <div className="wallet-modal-crypto-fiat">
                  <p>
                    {userBalances?.usdt ? roundPrice(userBalances.usdt) : "0"}
                  </p>
                  <p className="wallet-modal-usd-currency">
                    $
                    {userBalances?.usdt
                      ? getFiatPrice(userBalances.usdt, cryptoPrices.usdtPrice)
                      : "0"}
                  </p>
                </div>
              </div>
            </div>

            <Button
              colorScheme={"teal"}
              className="wallet-modal-add-funds-button"
              height="50px"
              display={"block"}
              onClick={openSwapModal}
            >
              Swap tokens
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default WalletModal;
