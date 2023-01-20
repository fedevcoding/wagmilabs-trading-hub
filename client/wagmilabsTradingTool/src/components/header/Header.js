import React, { useState, useEffect, useRef, useContext } from 'react'
//import Search from "./Search.js"
import EthereumSearch from "../search/EthereumSearch.js"
// import SearchSolana from "../search/SearchSolana.js"
import "./header.css"
import {useNavigate} from 'react-router-dom';

import logoImage from "../../assets/logo.png"
import baseUrl from "../../variables/baseUrl"
import RefreshToken from '../RefreshToken.js';
import logOut from '../../utils/functions/logout.js';
import CartModal from '../utility-components/CartModal.js';


import { UserDataContext } from '../../context/userContext';
import WalletModal from '../utility-components/WalletModal.js';

import getUserBalances from '../../utils/database-functions/getUserBalances.js';

import { fetchEnsName } from '@wagmi/core';
import { useAccount } from 'wagmi';



const Header = () => {

  
  const {setEns, setProfileImage, setListingSettings, profileImage, setUserCartItems, setUserBalances, setGasSettings, setConnected, connected, setSnipingTasks} = useContext(UserDataContext)
  
  const {address} = useAccount()



  // const navigate = useNavigate()
  const navigate = useNavigate()

  const [modalOpen, setModalOpen] = useState(false)
  const [walletModalOpen, setWalletModalOpen] = useState(false)


  // profile options hover
  useEffect(()=>{
    const profileOptionsContainer = document.querySelector(".pfp-options-container")
    const profileOptions = document.querySelector(".profile-options")

    let hovered;

    profileOptionsContainer.addEventListener("mouseover", () => {
      hovered = true
      profileOptions.classList.add("visible")
      profileOptions.classList.remove("invisible")
    })

    profileOptionsContainer.addEventListener("mouseout", () => {
      hovered = false
      setTimeout(()=> {
        if(!hovered){
          profileOptions.classList.remove("visible")
          profileOptions.classList.add("invisible")
        }
      }, 200)
    })

    profileOptionsContainer.addEventListener("click", () => {
        profileOptions.classList.remove("visible")
        profileOptions.classList.add("invisible")
    })
  }, [])

  // calendars dropdown hover
  useEffect(()=>{
      const calendarOptionContainer = document.querySelector(".calendars-button")
      const profileOptions = document.querySelector(".calendars-options-dropdown")
  
      let hovered;
  
      calendarOptionContainer.addEventListener("mouseover", () => {
          hovered = true
          profileOptions.classList.remove("invisible")
      })
  
      calendarOptionContainer.addEventListener("mouseout", () => {
        hovered = false
        setTimeout(()=> {
          if(!hovered){
            profileOptions.classList.add("invisible")
          }
        }, 300)
      })
  
      calendarOptionContainer.addEventListener("click", () => {
          profileOptions.classList.add("invisible")
      })
  }, []) 

  // bot dropdown hover
  useEffect(()=>{
    const calendarOptionContainer = document.querySelector(".bots-button")
    const profileOptions = document.querySelector(".bots-options-dropdown")

    let hovered;

    calendarOptionContainer.addEventListener("mouseover", () => {
        hovered = true
        profileOptions.classList.remove("invisible")
    })

    calendarOptionContainer.addEventListener("mouseout", () => {
      hovered = false
      setTimeout(()=> {
        if(!hovered){
          profileOptions.classList.add("invisible")
        }
      }, 300)
    })

    calendarOptionContainer.addEventListener("click", () => {
        profileOptions.classList.add("invisible")
    })
  }, []) 



  // get user infos
  useEffect(()=>{
    fetchUserData()
    getEnsName(address)
    getUserBalances(address, setUserBalances)
  }, [])

  async function getEnsName(address){
    const ensName = await fetchEnsName({
      address: address,
    })
    setEns(ensName)
  }

  async function fetchUserData(){
    let userData = await fetch(`${baseUrl}/userDetails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.jsonwebtoken
      },
      body: JSON.stringify({address: localStorage.userAddress})
    })
    userData = (await userData.json()).user
    

    setGasSettings(userData.gasSettings)
    setProfileImage(userData.profileImage)
    setListingSettings(userData.listSettings)
    setUserCartItems(userData.shoppingCart)
    setSnipingTasks(userData.bots.snipingBotTasks)
  }

  function openWalletModal(){
    setWalletModalOpen(true)
    document.body.classList.add("overflow-hidden")
  }
  function closeWalletModal(e){
    if(e.target !== e.currentTarget) return

    const modal = document.querySelector(".wallet-modal-container")
    modal.classList.remove("visible")

    setTimeout(()=>{
      setWalletModalOpen(false)
      document.body.classList.remove("overflow-hidden")
    }, 350)
  }


  function openCartModal(){
      setModalOpen(true)
      document.body.classList.add("overflow-hidden")
  }
  function closeCartModal(e){
      if(e.target !== e.currentTarget) return
      const el = document.querySelector(".cart-modal")
      el.style.animation = "width 250ms linear"
      el.classList.remove("active-cart-modal")
      setTimeout(()=>{
        setModalOpen(false)
        document.body.classList.remove("overflow-hidden")
      }, 250)
  }
    
  useEffect(()=>{
    if(modalOpen){
      setTimeout(()=>{
        const el = document.querySelector(".cart-modal")
        el.classList.add("active-cart-modal")
      }, 1)
    }

  }, [modalOpen])








  return (
    <>
    <RefreshToken connected={connected} setConnected={setConnected}/>
    <header className='search-header'>
      <img src={logoImage} onClick={() => navigate("/")} className="logo-image" alt="" />

      <EthereumSearch />

      <div className='header-links-container'>
      <a>
          <div className='bots-button header-links'>
            <span>Bots</span>
            
            <div className='bots-options-dropdown invisible'>
              <div onClick={() => navigate("/bots/sniper")}>Sniper bot</div>
              <div onClick={() => navigate("/bots/contractMinter")}>Contract minter</div>
              <div onClick={() => navigate("/bots/notifications")}>Notifications</div>
            </div>
        </div>
        </a>
        <a onClick={() => navigate("/calculators")}><div className='calcs-button header-links'>Calcs</div></a>
        <a onClick={() => navigate("/volumes")}><div className='volumes-button header-links'>Volumes</div></a>
        <a onClick={() => navigate("/profitandloss")}><div className='pnl-button header-links'>P&L</div></a>
        <a>
          <div className='calendars-button header-links'>
            <span>Calendars</span>
            
            <div className='calendars-options-dropdown invisible'>
              <div onClick={() => navigate("/profitandloss/drops")}>NFT drops</div>
              <div onClick={() => navigate("/profitandloss/spaces")}>Twitter spaces</div>
              <div onClick={() => navigate("/profitandloss/raffles")}>Raffle/allowlist</div>
              <div onClick={() => navigate("/profitandloss/events")}>IRL events</div>
            </div>
        </div>
        </a>
      </div>
      
      <div style={{display: "flex", width: "180px", justifyContent: "space-between", alignItems: "center"}}>
        <div className='pfp-options-container'>
          <img src={profileImage} alt="" className='pfp' onClick={() => navigate("/profile")}/>
          <div className='profile-options invisible'>
            <div onClick={() => navigate("/profile")} className="pfp-icon-container">
              <i className="fa-solid fa-circle-user"></i>
              <p>Profile</p>
            </div>

            <div className="switch-account-option-container">
              <i className="fa-solid fa-arrows-repeat"></i>
              <p>Switch account</p>
            </div>

            <div onClick={logOut} className="logout-container">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <p>Log Out</p>
            </div>
          </div>

        </div>

        <i className="fa-solid fa-wallet" style={{fontSize: "25px", cursor:"pointer"}} onClick={openWalletModal}></i>

        <i className="fa-solid fa-cart-shopping" style={{fontSize: "25px", cursor:"pointer"}} onClick={openCartModal}></i>


        
      </div>
      <WalletModal walletModalOpen={walletModalOpen} openWalletModal={openWalletModal} closeWalletModal={closeWalletModal}/>
      <CartModal modalOpen={modalOpen} openCartModal={openCartModal} closeCartModal={closeCartModal}/>

    </header>
    
    </>
  )
}

export default Header