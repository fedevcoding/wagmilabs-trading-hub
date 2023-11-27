import React, { useState, useEffect, useContext } from "react";
import EthereumSearch from "../search/EthereumSearch";
import "./header.scss";
import { Link, useNavigate } from "react-router-dom";

import { logo } from "@Assets";
import { baseUrl } from "@Variables";
import RefreshToken from "../RefreshToken";
import logOut from "@Utils/functions/logout";
import { CartModal, WalletModal } from "@Components";

import { UserDataContext } from "@Context";

import { useUpdateBalance } from "@Hooks";

import { fetchEnsName } from "@wagmi/core";
import { useAccount } from "wagmi";
import { useJwtData } from "@Hooks";
import moment from "moment";
import { useSubscribe } from "../../custom-hooks/useSubscribe";

const Header = () => {
  const { isFree, isPartnership, expiration } = useJwtData();
  const { subscribe } = useSubscribe();

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
      profileOptions?.classList?.add("visible");
      profileOptions?.classList?.remove("invisible");
    }
    function profileMouseOut() {
      hovered = false;
      setTimeout(() => {
        if (!hovered) {
          profileOptions?.classList?.remove("visible");
          profileOptions?.classList?.add("invisible");
        }
      }, 100);
    }
    function profileClick() {
      profileOptions?.classList?.remove("visible");
      profileOptions?.classList?.add("invisible");
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
  // useEffect(() => {
  //   const calendarOptionContainer = document.querySelector(".calendars-button");
  //   const profileOptions = document.querySelector(".calendars-options-dropdown");

  //   let hovered;

  //   function calendarsMouseOver() {
  //     hovered = true;
  //     profileOptions?.classList?.remove("invisible");
  //     calendarOptionContainer?.classList?.add("before");
  //   }

  //   function calendarsMouseOut() {
  //     hovered = false;
  //     setTimeout(() => {
  //       if (!hovered) {
  //         profileOptions?.classList?.add("invisible");
  //         calendarOptionContainer?.classList?.remove("before");
  //       }
  //     }, 200);
  //   }

  //   function calendarsClick() {
  //     profileOptions?.classList?.add("invisible");
  //   }

  //   calendarOptionContainer.addEventListener("mouseover", calendarsMouseOver);

  //   calendarOptionContainer.addEventListener("mouseout", calendarsMouseOut);

  //   calendarOptionContainer.addEventListener("click", calendarsClick);

  //   return () => {
  //     calendarOptionContainer.removeEventListener("mouseover", calendarsMouseOver);
  //     calendarOptionContainer.removeEventListener("mouseout", calendarsMouseOut);
  //     calendarOptionContainer.removeEventListener("click", calendarsClick);
  //   };
  // }, []);

  // bot dropdown hover
  useEffect(() => {
    const calendarOptionContainer = document.querySelector(".bots-button");
    const profileOptions = document.querySelector(".bots-options-dropdown");

    let hovered;

    calendarOptionContainer.addEventListener("mouseover", () => {
      hovered = true;
      profileOptions?.classList?.remove("invisible");
      calendarOptionContainer?.classList?.add("before");
    });

    calendarOptionContainer.addEventListener("mouseout", () => {
      hovered = false;
      setTimeout(() => {
        if (!hovered) {
          profileOptions?.classList?.add("invisible");
          calendarOptionContainer?.classList?.remove("before");
        }
      }, 200);
    });

    calendarOptionContainer.addEventListener("click", () => {
      profileOptions?.classList?.add("invisible");
    });
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
    document.body?.classList.add("overflow-hidden");
  }
  function closeWalletModal(e) {
    if (e.target !== e.currentTarget) return;

    const modal = document.querySelector(".wallet-modal-container");
    modal?.classList.remove("visible");

    setTimeout(() => {
      setWalletModalOpen(false);
      document.body?.classList.remove("overflow-hidden");
    }, 350);
  }

  function openCartModal() {
    setModalOpen(true);
    document.body?.classList.add("overflow-hidden");
  }
  function closeCartModal(e) {
    if (e.target !== e.currentTarget) return;
    const el = document.querySelector(".cart-modal");
    el.style.animation = "width 250ms linear";
    el?.classList.remove("active-cart-modal");
    setTimeout(() => {
      setModalOpen(false);
      document.body?.classList.remove("overflow-hidden");
    }, 250);
  }

  useEffect(() => {
    if (modalOpen) {
      setTimeout(() => {
        const el = document.querySelector(".cart-modal");
        el?.classList.add("active-cart-modal");
      }, 1);
    }
  }, [modalOpen]);

  const section = window.location.pathname;

  return (
    <>
      <RefreshToken connected={connected} setConnected={setConnected} />
      {isPartnership && (
        <header className="expiration-header">
          <p>FREE pro ending {moment(expiration).fromNow()}</p>
          <p className="upgrade" onClick={() => subscribe(2, 1, 0.03)}>
            Upgrade now!
          </p>
        </header>
      )}
      {isFree && (
        <header className="expiration-header">
          <p>Access more features and instant data</p>
          <p className="upgrade" onClick={() => subscribe(2, 1, 0.03)}>
            Upgrade now!
          </p>
        </header>
      )}

      <header className="search-header">
        <Link to="/">
          <img src={logo} className="logo-image" alt="" />
        </Link>

        <EthereumSearch isHeader={true} />

        <div className="header-links-container">
          <div>
            <div className="bots-button header-links">
              <span>Bots</span>

              <div className="bots-options-dropdown invisible">
                <div onClick={() => navigate("/bots/wallets")}>Wallets</div>
                <div onClick={() => navigate("/bots/sniper")}>Sniper bot</div>
                <div className="not-allowed">Minting bot</div>
                <div className="not-allowed">Notifications</div>
              </div>
            </div>
          </div>
          <div onClick={() => navigate("/volumes")}>
            <div className={`${section === "/volumes" ? "active" : ""} volumes-button header-links`}>Volumes</div>
          </div>
          <div>
            <div
              className={`${section === "/profitandloss" ? "active" : ""} pnl-button header-links`}
              onClick={() => navigate("/profitandloss")}
            >
              <span>P&L</span>
            </div>
          </div>
          <div onClick={() => navigate("/feed")}>
            <div className={`${section === "/feed" ? "active" : ""} feed-button header-links`}>Feed</div>
          </div>
          <div>
            <div className="calendars-button header-links not-allowed">
              <span>Calendars</span>

            {/*
              <div className="calendars-options-dropdown invisible">
                <div onClick={() => navigate("/calendars/drops")}>NFT drops</div>
                <div onClick={() => navigate("/calendars/spaces")}>Twitter spaces</div>
                <div onClick={() => navigate("/calendars/personal")}>Personal</div>
                <div onClick={() => navigate("/calendars/events")}>IRL events</div>
              </div>
            */}
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
            <Link to={`/profile/${address}`}>
              <img src={profileImage} alt="" className="pfp" />
            </Link>
            <div className="profile-options invisible">
              <a href={`/profile/${address}`}>
                <div onClick={() => navigate(`/profile/${address}`)} className="pfp-icon-container">
                  <i className="fa-solid fa-circle-user"></i>
                  <p>Profile</p>
                </div>
              </a>

              <div className="switch-account-option-container" onClick={() => navigate("/bots/wallets")}>
                <i className="fa-solid fa-arrows-repeat"></i>
                <p>Wallets</p>
              </div>

              <div onClick={() => navigate("/plans")} className="switch-account-option-container">
                <i className="fa-solid fa-tags"></i>
                <p>Plans</p>
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
