import React, { useState, useEffect, useContext } from "react";
import EthereumSearch from "../search/EthereumSearch";
import "./header.css";
import { useNavigate } from "react-router-dom";

import logoImage from "@Assets/logoBeta.png";
import { baseUrl } from "@Variables";
import RefreshToken from "../RefreshToken";
import logOut from "@Utils/functions/logout";
import { CartModal, WalletModal } from "@Components";

import { UserDataContext } from "@Context";

import { useUpdateBalance } from "@Hooks";

import { fetchEnsName } from "@wagmi/core";
import { useAccount } from "wagmi";

const Header = () => {
  const {
    setEns,
    setProfileImage,
    setListingSettings,
    profileImage,
    setUserCartItems,
    setGasSettings,
    setConnected,
    connected,
  } = useContext(UserDataContext);

  const { address } = useAccount();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const updateBalance = useUpdateBalance(address);

  // profile options hover
  useEffect(() => {
    const profileOptionsContainer = document.querySelector(".pfp-options-container");
    const profileOptions = document.querySelector(".profile-options");

    let hovered;

    function profileMouseOver() {
      hovered = true;
      profileOptions.classList.add("visible");
      profileOptions.classList.remove("invisible");
    }
    function profileMouseOut() {
      hovered = false;
      setTimeout(() => {
        if (!hovered) {
          profileOptions.classList.remove("visible");
          profileOptions.classList.add("invisible");
        }
      }, 200);
    }
    function profileClick() {
      profileOptions.classList.remove("visible");
      profileOptions.classList.add("invisible");
    }

    profileOptionsContainer.addEventListener("mouseover", profileMouseOver);

    profileOptionsContainer.addEventListener("mouseout", profileMouseOut);

    profileOptionsContainer.addEventListener("click", profileClick);

    return () => {
      profileOptionsContainer.removeEventListener("mouseover", profileMouseOver);
      profileOptionsContainer.removeEventListener("mouseout", profileMouseOut);
      profileOptionsContainer.removeEventListener("click", profileClick);
    };
  }, []);

  // calendars dropdown hover
  useEffect(() => {
    const calendarOptionContainer = document.querySelector(".calendars-button");
    const profileOptions = document.querySelector(".calendars-options-dropdown");

    let hovered;

    function calendarsMouseOver() {
      hovered = true;
      profileOptions.classList.remove("invisible");
    }

    function calendarsMouseOut() {
      hovered = false;
      setTimeout(() => {
        if (!hovered) {
          profileOptions.classList.add("invisible");
        }
      }, 300);
    }

    function calendarsClick() {
      profileOptions.classList.add("invisible");
    }

    calendarOptionContainer.addEventListener("mouseover", calendarsMouseOver);

    calendarOptionContainer.addEventListener("mouseout", calendarsMouseOut);

    calendarOptionContainer.addEventListener("click", calendarsClick);

    return () => {
      calendarOptionContainer.removeEventListener("mouseover", calendarsMouseOver);
      calendarOptionContainer.removeEventListener("mouseout", calendarsMouseOut);
      calendarOptionContainer.removeEventListener("click", calendarsClick);
    };
  }, []);

  // bot dropdown hover
  useEffect(() => {
    const calendarOptionContainer = document.querySelector(".bots-button");
    const profileOptions = document.querySelector(".bots-options-dropdown");

    let hovered;

    calendarOptionContainer.addEventListener("mouseover", () => {
      hovered = true;
      profileOptions.classList.remove("invisible");
    });

    calendarOptionContainer.addEventListener("mouseout", () => {
      hovered = false;
      setTimeout(() => {
        if (!hovered) {
          profileOptions.classList.add("invisible");
        }
      }, 300);
    });

    calendarOptionContainer.addEventListener("click", () => {
      profileOptions.classList.add("invisible");
    });
  }, []);

  // pnl dropdown hover
  useEffect(() => {
    const pnlOptionContainer = document.querySelector(".pnl-button");
    const profileOptions = document.querySelector(".pnl-options-dropdown");

    let hovered;

    function pnlMouseOver() {
      hovered = true;
      profileOptions.classList.remove("invisible");
    }

    function pnlMouseOut() {
      hovered = false;
      setTimeout(() => {
        if (!hovered) {
          profileOptions.classList.add("invisible");
        }
      }, 300);
    }

    function pnlClick() {
      profileOptions.classList.add("invisible");
    }

    pnlOptionContainer.addEventListener("mouseover", pnlMouseOver);

    pnlOptionContainer.addEventListener("mouseout", pnlMouseOut);

    pnlOptionContainer.addEventListener("click", pnlClick);

    return () => {
      pnlOptionContainer.removeEventListener("mouseover", pnlMouseOver);
      pnlOptionContainer.removeEventListener("mouseout", pnlMouseOut);
      pnlOptionContainer.removeEventListener("click", pnlClick);
    };
  }, []);

  // get user infos
  useEffect(() => {
    fetchUserData();
    getEnsName(address);
    updateBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getEnsName(address) {
    try {
      const ensName = await fetchEnsName({
        address: address,
      });
      setEns(ensName);
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchUserData() {
    try {
      const res = await fetch(`${baseUrl}/userDetails`, {
        headers: {
          "x-auth-token": localStorage.jsonwebtoken,
        },
      });

      if (!res.ok) throw new Error("error");

      const userData = await res.json();

      const { gasSettings, profileImage, listSettings, shoppingCart } = userData || {};

      // const { snipingBotTasks } = bots || {};

      setGasSettings({ ...gasSettings, maxFeePerGas: 0 });
      setProfileImage(profileImage);
      setListingSettings(listSettings);
      setUserCartItems(shoppingCart);
    } catch (e) {
      console.log(e);
    }
  }

  function openWalletModal() {
    setWalletModalOpen(true);
    document.body.classList.add("overflow-hidden");
  }
  function closeWalletModal(e) {
    if (e.target !== e.currentTarget) return;

    const modal = document.querySelector(".wallet-modal-container");
    modal.classList.remove("visible");

    setTimeout(() => {
      setWalletModalOpen(false);
      document.body.classList.remove("overflow-hidden");
    }, 350);
  }

  function openCartModal() {
    setModalOpen(true);
    document.body.classList.add("overflow-hidden");
  }
  function closeCartModal(e) {
    if (e.target !== e.currentTarget) return;
    const el = document.querySelector(".cart-modal");
    el.style.animation = "width 250ms linear";
    el.classList.remove("active-cart-modal");
    setTimeout(() => {
      setModalOpen(false);
      document.body.classList.remove("overflow-hidden");
    }, 250);
  }

  useEffect(() => {
    if (modalOpen) {
      setTimeout(() => {
        const el = document.querySelector(".cart-modal");
        el.classList.add("active-cart-modal");
      }, 1);
    }
  }, [modalOpen]);

  const isVolumesPage = window.location.pathname === "/volumes";

  return (
    <>
      <RefreshToken connected={connected} setConnected={setConnected} />
      <header className="search-header">
        <img src={logoImage} onClick={() => navigate("/")} className="logo-image" alt="" />

        <EthereumSearch />

        <div className="header-links-container">
          <div>
            <div className="bots-button header-links not-allowed">
              <span>Bots</span>
            </div>
          </div>
          <div onClick={() => navigate("/volumes")}>
            <div className={`${isVolumesPage ? "active" : ""} volumes-button header-links`}>Volumes</div>
          </div>
          <div>
            <div className="pnl-button header-links" onClick={() => navigate("/profitandloss")}>
              <span>P&L</span>
            </div>
          </div>
          <div onClick={() => navigate("/feed")}>
            <div className="feed-button header-links">Feed</div>
          </div>
          <div>
            <div className="calendars-button header-links not-allowed">
              <span>Calendars</span>

              <div className="calendars-options-dropdown invisible">
                <div onClick={() => navigate("/calendars/drops")}>NFT drops</div>
                <div onClick={() => navigate("/calendars/spaces")}>Twitter spaces</div>
                <div onClick={() => navigate("/calendars/raffles")}>Personal</div>
                <div onClick={() => navigate("/calendars/events")}>IRL events</div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: "180px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="pfp-options-container">
            <img src={profileImage} alt="" className="pfp" onClick={() => navigate("/profile")} />
            <div className="profile-options invisible">
              <div onClick={() => navigate("/profile")} className="pfp-icon-container">
                <i className="fa-solid fa-circle-user"></i>
                <p>Profile</p>
              </div>

              <div className="switch-account-option-container not-allowed">
                <i className="fa-solid fa-arrows-repeat"></i>
                <p>Switch account</p>
              </div>

              <div onClick={() => logOut(setConnected)} className="logout-container">
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <p>Log Out</p>
              </div>
            </div>
          </div>

          <i
            className="fa-solid fa-wallet low-opacity"
            style={{ fontSize: "25px", cursor: "pointer", color: "white" }}
            onClick={openWalletModal}
          ></i>

          <i
            className="header-cart-item fa-solid fa-cart-shopping low-opacity"
            style={{ fontSize: "25px", cursor: "pointer", color: "white" }}
            onClick={openCartModal}
          ></i>
        </div>
        <WalletModal
          walletModalOpen={walletModalOpen}
          openWalletModal={openWalletModal}
          closeWalletModal={closeWalletModal}
        />
        <CartModal modalOpen={modalOpen} openCartModal={openCartModal} closeCartModal={closeCartModal} />
      </header>
    </>
  );
};

export default Header;
