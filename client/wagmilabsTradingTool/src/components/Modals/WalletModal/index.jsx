import React, { useContext, useEffect, useState } from "react";

import "./style.scss";

import { UserDataContext } from "@Context";
import { useAccount } from "wagmi";
import {
  formatAddress,
  getFiatPrice,
  roundPrice,
} from "@Utils/formats/formats";

import {
  ethereumImage,
  usdcImage,
  usdtImage,
  wrappedEthereumImage,
} from "@Assets";

import logOut from "@Utils/functions/logout";
import { Button, Tooltip } from "@chakra-ui/react";
import { LivePulsing } from "@Components";

// uniswap widget
import copy from "copy-to-clipboard";
import { SwapWidget } from "@uniswap/widgets";
import "@uniswap/widgets/fonts.css";
import { ETHEREUM_NETWORK } from "@Variables";
import { useConnected } from "@Hooks";
import { ethers } from "ethers";

const jsonRpcUrlMap = {
  1: [ETHEREUM_NETWORK],
};

console.warn = function () {};

const theme = {
  primary: "#FFF",
  secondary: "#A9A9A9",
  interactive: "#000",
  container: "#4E4E5A",
  module: "#222633",
  accent: "#71FF98",
  outline: "#CC1",
  dialog: "#000",
  fontFamily: "Poppins",
  borderRadius: { large: 8 },
};

export const WalletModal = ({ walletModalOpen, closeWalletModal }) => {
  const { setConnected } = useConnected();

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
    console.log("provider", provider);
  }, [provider]);

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

    const proivder = new ethers.providers.Web3Provider(currentProvider);
    setProvider(proivder);
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
                  className="swap-tokens-widget"
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

              <div
                className="wallet-modal-logout-container"
                onClick={() => logOut(setConnected)}
              >
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
