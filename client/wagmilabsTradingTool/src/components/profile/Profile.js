import React, {useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import "./profile.css"
import baseUrl from "../../variables/baseUrl"
import rippleEffect from '../../utils/functions/rippleEffect'
import Nfts from './sections/nfts/Nfts'
import Activity from './sections/activity/Activity'
import { Portal } from "react-portal"
import ClipboardJS from "clipboard"
import { formatAddress } from '../../utils/formats/formats'

import { useAccount, useEnsName, useSigner } from 'wagmi'

import { UserDataContext } from '../../context/userContext'



const Profile = () => {
  const navigate = useNavigate()

  const { address } = useAccount()
  const ensName = useEnsName({address})

  const {listingSettings, setListingSettings, profileImage, setProfileImage} = useContext(UserDataContext)


  const [userItems, setUserItems] = useState([])
  const [userAddress] = useState(address)
  const [pnl, setPnl] = useState({})
  const [userEns] = useState(ensName?.data)
  const [collections, setCollections] = useState(null)
  const [activityTransactions, setActivityTransactions] = useState(null)
  const [section, setSection] = useState("nft")

  const [openListingSettings, setOpenListingSettings] = useState(false)

  const [loadingNfts, setLoadingNfts] = useState(true)

  // const [copyState, setCopyState] = useState("Copy")
  // const [copyActive, setCopyActive] = useState(false)



  useEffect(()=>{
    new ClipboardJS(".address-copy-btn")
    fetchUserItems()
    fetchUserData()
  }, [])

  useEffect(()=>{
    if(openListingSettings && listingSettings){
      let monthsValue = listingSettings.time.months
      document.querySelectorAll(`#listing-settings-months option`)[monthsValue].selected = true

      let daysValue = listingSettings.time.days
      document.querySelectorAll(`#listing-settings-days option`)[daysValue].selected = true

      let hoursValue = listingSettings.time.hours
      document.querySelectorAll(`#listing-settings-hours option`)[hoursValue].selected = true

      let minutesValue = listingSettings.time.minutes
      document.querySelectorAll(`#listing-settings-minutes option`)[minutesValue].selected = true


      const marketplaceMapping = {
        "opensea": 0,
        "x2y2": 1,
        "looksrare": 2,
      }

      let marketplaceValue = listingSettings.marketplace
      document.querySelectorAll("#listing-settings-marketplace option")[marketplaceMapping[marketplaceValue]].selected = true

      if(listingSettings.price.type === "profit"){
        let value = listingSettings.price.value
        document.querySelector(".listing-settings-value").value = value
  
        const currencyMapping = {
          "%": 0,
          "eth": 1,
          "usd": 2,
        }

        let currencyType = listingSettings.price.currency
        document.querySelectorAll(".listing-settings-currency-type option")[currencyMapping[currencyType]].selected = true

      }
      else{
        document.querySelector(".listing-settings-profit-values").style.display = "none"
      }
    }
  }, [openListingSettings])





  async function fetchUserItems(){
      try{
        let data = await fetch(`${baseUrl}/profileItems`, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.jsonwebtoken
          },
        })
        data = (await data.json())

        console.log(data)

        const {items, userCollections} = data

        setUserItems(items)
        setCollections(userCollections)
        setLoadingNfts(false)
      }
      catch(e){
        console.error(e)
      }
  }

  async function fetchUserData(){
    let data = await fetch(`${baseUrl}/profileStats/${address}`, {
      headers: {
        "x-auth-token": localStorage.jsonwebtoken
      }
    })
    data = await (data.json())
    console.log(data)
    const {num_txs, num_assets_owned, num_collections_owned, total_gain, nftsValue, walletVolume, mint_count, sold_count, bought_count, sold_value} = data

    setPnl({nfts: num_assets_owned, collections: num_collections_owned, totalTxs: num_txs, nftsValue, realizedPnl: total_gain, walletVolume, mintCount: mint_count, soldCount: sold_count, boughtCount: bought_count, soldValue: sold_value})
  }








  const toggleListingSettings = state => {
    setOpenListingSettings(state)
    document.body.style.overflow = state ? "hidden" : "auto"
  }

  const saveListingSettings = async () => {
    let monthsSelector = document.querySelector(`#listing-settings-months`)
    let months = parseInt(monthsSelector.options[monthsSelector.selectedIndex].value)

    let daysSelector = document.querySelector(`#listing-settings-days`)
    let days = parseInt(daysSelector.options[daysSelector.selectedIndex].value)

    let hoursSelector = document.querySelector(`#listing-settings-hours`)
    let hours = parseInt(hoursSelector.options[hoursSelector.selectedIndex].value)

    let minutesSelector = document.querySelector(`#listing-settings-minutes`)
    let minutes = parseInt(minutesSelector.options[minutesSelector.selectedIndex].value)

    let marketplaceSelector = document.querySelector("#listing-settings-marketplace")
    let marketplace = marketplaceSelector.options[marketplaceSelector.selectedIndex].value

    const priceTypesArray = document.querySelectorAll(".listing-settings-radio-button")
    const type = [...priceTypesArray].filter(el => el.checked)[0].getAttribute("pricetype")

    let value = undefined;
    let currency = undefined;

    if(type === "profit"){
      value = parseInt(document.querySelector(".listing-settings-value").value)
      let currencyEl = document.querySelector(".listing-settings-currency-type")
      currency = currencyEl.options[currencyEl.selectedIndex].value
    }


    try{
      let bodyObj = {
        marketplace,
        price: {
          type,
          value,
          currency
        },
        time: {
          months,
          days,
          hours,
          minutes
        }
      }

      let response = await fetch(`${baseUrl}/updateListingSettings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.jsonwebtoken     
        },
        body: JSON.stringify(bodyObj)
      })
      response = await response.json()
      if(response.updated){
        setListingSettings(bodyObj)
      }

    }
    catch(e){
      console.log(e)
    }
    
  }

  const priceTypeHandler = e => {
    const el = e.target
    if(el.classList.contains("profit-listing-settings")){
      document.querySelector(".break-even-listing-settings").checked = false
      document.querySelector(".listing-settings-profit-values").style.display = "block"
    }
    else{
      document.querySelector(".profit-listing-settings").checked = false
      document.querySelector(".listing-settings-profit-values").style.display = "none"
    }
  }


  const changeSection = (section, e) => {
    document.querySelectorAll(".single-profile-section").forEach(el => el.classList.remove("selected"))
    e.target.classList.add("selected")
    setSection(section)
  }


  return (
    <>

    {
      openListingSettings && 
      <Portal>
        <div className='bg-modal'></div>
        <section className='nft-listing-modal'>
        {
          listingSettings ?
          <>
          <button onClick={() => toggleListingSettings(false)}>x</button>
          <div className='listing-settings-title'>
            <p>Smart listing settings</p>
            <p>Custom preset</p>
          </div>

          <div className='listing-settings-price'>
            <p>Price:</p>
              <div>
                <input type="radio" pricetype="break-even" className='break-even-listing-settings listing-settings-radio-button' id="break-even-radio-button" defaultChecked={listingSettings.price.type === "break-even" ? true : false} onChange={e => priceTypeHandler(e)}/>
                <label htmlFor="break-even-radio-button">Break Even</label>
              </div>

              <div>
                <input type="radio" pricetype="profit" id="profit-radio-button" className='profit-listing-settings listing-settings-radio-button' defaultChecked={listingSettings.price.type === "profit" ? true : false} onChange={e => priceTypeHandler(e)}/>
                <label htmlFor="profit-radio-button">Profit</label>
                <div className='listing-settings-profit-values'>
                  <input type="number" className='listing-settings-value'/>
                  <select name="" id="" className='listing-settings-currency-type'>
                    <option value="%">%</option>
                    <option value="eth">Eth</option>
                    <option value="usd">Usd</option>
                  </select>
                </div> 
              </div>
          </div>

          <div>
            <div>Listing will be active for:</div>
            <select id="listing-settings-months">
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
            <label htmlFor="listing-settings-months">Months</label>

            <select id="listing-settings-days">
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
              <option value="21">21</option>
              <option value="22">22</option>
              <option value="23">23</option>
              <option value="24">24</option>
              <option value="25">25</option>
              <option value="26">26</option>
              <option value="27">27</option>
              <option value="28">28</option>
              <option value="29">29</option>
              <option value="39">30</option>
            </select>
            <label htmlFor="listing-settings-days">Days</label>

            <select id="listing-settings-hours">
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
              <option value="21">21</option>
              <option value="22">22</option>
              <option value="23">23</option>
              <option value="24">24</option>
            </select>
            <label htmlFor="listing-settings-hours">hours</label>

            <select id="listing-settings-minutes">
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
              <option value="21">21</option>
              <option value="22">22</option>
              <option value="23">23</option>
              <option value="24">24</option>
              <option value="25">25</option>
              <option value="26">26</option>
              <option value="27">27</option>
              <option value="28">28</option>
              <option value="29">29</option>
              <option value="39">30</option>
              <option value="31">31</option>
              <option value="32">32</option>
              <option value="33">33</option>
              <option value="34">34</option>
              <option value="35">35</option>
              <option value="36">36</option>
              <option value="37">37</option>
              <option value="38">38</option>
              <option value="39">39</option>
              <option value="40">40</option>
              <option value="41">41</option>
              <option value="42">42</option>
              <option value="43">43</option>
              <option value="44">44</option>
              <option value="45">45</option>
              <option value="46">46</option>
              <option value="47">47</option>
              <option value="48">48</option>
              <option value="49">49</option>
              <option value="50">50</option>
              <option value="51">51</option>
              <option value="52">52</option>
              <option value="53">53</option>
              <option value="54">54</option>
              <option value="55">55</option>
              <option value="56">56</option>
              <option value="57">57</option>
              <option value="58">58</option>
              <option value="59">59</option>
              <option value="60">60</option>
            </select>
            <label htmlFor="listing-settings-minutes">Minutes</label>
          </div>

          <div>
            <p>Marketplace:</p>
            <select name="" id="listing-settings-marketplace">
              <option value="opensea">Opensea</option>
              <option value="x2y2">X2Y2</option>
              <option value="looksrare">LooksRare</option>
            </select>
          </div>

          <button onClick={saveListingSettings}>Save</button>
          </>
              :
              <>loading</>
            }
            </section>
      </Portal>
    }


    <section className='profile-section-container'>
    <div className='profile-container'>
      <div className='profileDetails'>
        <img className='profilePfp' src={profileImage} alt="" />
        <div className='profile-ens-address'>
          <span>{userEns && userEns}</span>
          <span>{userAddress && userEns && "/"}</span>
          <span className='profile-address-copy'>{userAddress && formatAddress(userAddress)}</span>
          
          {/* {userAddress && <i data-clipboard-text={userAddress} onMouseOver={()=> setCopyActive(true)} onMouseLeave={() => setCopyActive(false)} onClick={setCopyText} className="fa-regular fa-copy address-copy-btn"></i>} */}
          {/* {copyActive && <>
            <div>{copyState}</div>
          </>} */}
        </div>
        
        <div className='profile-details-container'>
          <div className='single-profile-detail'>
            <div>Nft's</div>
            <p>{pnl?.nfts || (<Spinner />)}</p>
          </div>

          <div className='single-profile-detail'>
            <div>Unique colletions</div>
            <p>{pnl?.collections || <Spinner />}</p>
          </div>

          <div className='single-profile-detail'>
            <div>Nft transactions</div>
            <p>{pnl?.totalTxs || <Spinner />}</p>
          </div>
        </div>
      </div>

      <div className='profilePnl'>
        <div className='number-profits-losses'>
          <p>Mint count
            <div className='nft-pnl-profit'>
              {pnl?.mintCount || <Spinner />}
            </div>
          </p>

          <p>Bought count
            <div className='nft-pnl-profit'>
              {pnl?.boughtCount || <Spinner />}
            </div>
          </p>

          <p>Sold count
            <div className='nft-pnl-profit'>
              {pnl?.soldCount || <Spinner />}
            </div>
          </p>
          
          <p>Sold value
            <div className='nft-pnl-profit'>
              {pnl?.soldValue || <Spinner />}
              <span className='eth-char-logo'>Ξ</span>
            </div>
          </p>
        </div>

        <div className='avg-pnl'>
          <p>Nfts avg. value
            <div className='nft-pnl-profit'>
              {
                pnl?.nftsValue ?
                (
                  <span className={"nft-pnl-profit"}>
                    {Math.round(pnl.nftsValue * 1000) / 1000} 
                    <span className='eth-char-logo'>Ξ</span>
                  </span>
                )
                :
                <Spinner />
              }
            </div>
          </p>
          <p>Realized Pnl
            <div>
              {
                pnl?.realizedPnl ?
                (<>
                  <span className={Math.round(pnl.realizedPnl * 1000) / 1000 >= 0 ? "nft-pnl-profit" : "nft-pnl-loss"}>
                    {Math.round(pnl.realizedPnl * 1000) / 1000} 
                    <span className='eth-char-logo'>Ξ</span>
                  </span>
                </>) 
                :
                <Spinner />
              }
            </div>
          </p>
          <p>Wallet volume
            <div>
              {
                pnl?.walletVolume ?
                (<>
                  <span className={"nft-pnl-profit"}>
                    {Math.round(pnl.walletVolume * 1000) / 1000} 
                    <span className='eth-char-logo'>Ξ</span>
                  </span>
                </>)
                :
                <Spinner />
              }
            </div>
          </p>
        </div>
      </div>
    </div>

    <div className='profile-sections-tabs'>
      <div className='profile-sections'>
        <div className='single-profile-section selected' onClick={(e)=> changeSection("nft", e)}>NFTs</div>
        <div className='single-profile-section' onClick={(e)=> changeSection("activity", e)}>Activity</div>
        <div className="single-profile-section">Stats</div>
      </div>

      <div className='profile-watchList-settings'>
        <div className='profile-settings'>
          <div className='profile-settings-button' onClick={() => toggleListingSettings(true)}>Listing settings<i class="fa-solid fa-gear"></i></div>
        </div>
        <div className='profile-watchList'>
          <div className='profile-watchList-button' onClick={(e)=> {rippleEffect(e); setTimeout(()=> navigate("/profile/watchlist"), 300);}}>WatchList <i className="fa-solid fa-angle-right"></i></div>
        </div>
        
      </div>
    </div>


    {
      (()=>{
        if(section === "nft"){
          return(
            <Nfts activityTransactions={activityTransactions} userItems={userItems} setProfileImage={setProfileImage} collections={collections} loadingNfts={loadingNfts} listingSettings={listingSettings}/>
          )
        }
        else if(section === "activity"){
          return(
            <Activity activityTransactions={activityTransactions} setActivityTransactions={setActivityTransactions} userAddress={userAddress}/>
          )
        }
      })()
    }

    </section>
    </>
  )
}


const Spinner = () => {
  return (
    <div className='loader-container'>
      <svg className="profile-spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle></svg>
    </div>
  )
}

export default Profile