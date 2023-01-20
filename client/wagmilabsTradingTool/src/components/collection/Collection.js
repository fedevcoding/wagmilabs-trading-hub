import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import questionImage from "../../assets/question.png"

import Items from "./sections/items/Items"
import Activity from "./sections/activity/Activity"
import Charts from "./sections/charts/Charts"
import Leaderboard from "./sections/leaderboard/Leaderboard"
import fullStar from "../../assets/full-star.png"
import emptyStar from "../../assets/empty-star.png"
import hoverStar from "../../assets/hover-star.png"

// import { useMoralisWeb3Api } from "react-moralis";
import "./collection.css"

import etherscan from "../../assets/etherscan.png"
import opensea from "../../assets/opensea.png"
import x2y2 from "../../assets/x2y2.png"
import www from "../../assets/www.png"
import twitter from "../../assets/twitter.png"
import looksRare from "../../assets/looksRare.png"
import discord from "../../assets/discord.png"
import gem from "../../assets/gem.png"
import baseUrl from '../../variables/baseUrl';
import removeFromWatchList from '../../utils/database-functions/removeFromWatchList';
import addToWatchList from '../../utils/database-functions/addToWatchList';
import getWatchListCollections from '../../utils/database-functions/getWatchList';
import { getPercentage } from '../../utils/formats/utils';
import { formatContractAddress, roundPrice } from '../../utils/formats/formats';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import LiveView from './sections/liveView/LiveView';
import LivePulsing from '../utility-components/LivePulsing';

// import verified from "../../images/verified-2.png"
// import notVerified from "../../images/not-verified.png"


// utils
import { formatTime } from '../../utils/formats/formats';
import getMarketplaceImage from '../../utils/marketplaceImageMapping';



import copy from 'copy-to-clipboard';


    
let sortMapping = {
    "p-lth": "lowestAsk",
    "p-htl": "highestAsk",
    "t-htl": "tokenId-desc",
    "t-lth": "tokenId-asc",
    "r-htl": "rarity",
}


const Collection = () => {

    const {address} = useParams();
    // const Web3Api = useMoralisWeb3Api();
    const [collectionInfo, setCollectionInfo] = useState({})
    const [extra, setExtra] = useState(false)
    const [isWatchList, setIsWatchList] = useState()
    const [section, setSection] = useState("items")
    const [loadingCollection, setLoadingCollection] = useState(true)
    const [copyState, setCopyState] = useState({hovered: false, value: "Copy"})




    // items.js states
    const [sorts, setSorts] = useState({
        sortBy: "p-lth",
        buyNow: false,
        priceFilter: {
          min: undefined,
          max: undefined
        },
        marketplaces: {
          opensea: false,
          x2y2: false,
          looksrare: false
        }
    })
    const [loadingItems, setLoadingItems] = useState(true)
    const [buyNowChecked, setBuyNowChecked] = useState(false)
    const [items, setItems] = useState([])


    useEffect(()=>{
        address && fetchTokens()
    }, [sorts])


    // async function fetchTokens(){
    //     setLoadingItems(true)

    //     const {opensea, x2y2, looksrare} = sorts.marketplaces
    //     let marketplaces = ""
    //     if(opensea && x2y2 && looksrare) marketplaces = "&marketplaces=opensea,x2y2,looksrare"
    //     else if(opensea && x2y2) marketplaces = "&marketplaces=opensea,x2y2"
    //     else if(opensea && looksrare) marketplaces = "&marketplaces=opensea,looksrare"
    //     else if(x2y2 && looksrare) marketplaces = "&marketplaces=x2y2,looksrare"
    //     else if(opensea) marketplaces = "&marketplaces=opensea"
    //     else if(x2y2) marketplaces = "&marketplaces=x2y2"
    //     else if(looksrare) marketplaces = "&marketplaces=looksrare"

    //     const {min, max} = sorts.priceFilter
    //     let priceFilter = ""
    //     if(sorts.buyNow) priceFilter = "&priceFilter=ETH,0,"
    //     if(min) priceFilter = `&priceFilter=ETH,${min},`
    //     if(max) priceFilter = `&priceFilter=ETH,0,${max}`
    //     if(max && min) priceFilter = `&priceFilter=ETH,${min},${max}`

    //     let url = `https://api.gomu.co/rest/nfts/by-contract?limit=100&includeLastTransfer=false&contractAddress=${address}&sortBy=${sortMapping[sorts.sortBy]}${priceFilter}${marketplaces}`

    //     let data = await fetch(url)
    //     data = (await data.json()).data
    //     console.log(data)
    //     setItems(data)
    //     setLoadingItems(false)
    // }
    async function fetchTokens(){
        setLoadingItems(true)

        const {opensea, x2y2, looksrare} = sorts.marketplaces
        let marketplaces = ""
        if(opensea && x2y2 && looksrare) marketplaces = "&marketplaces=opensea,x2y2,looksrare"
        else if(opensea && x2y2) marketplaces = "&marketplaces=opensea,x2y2"
        else if(opensea && looksrare) marketplaces = "&marketplaces=opensea,looksrare"
        else if(x2y2 && looksrare) marketplaces = "&marketplaces=x2y2,looksrare"
        else if(opensea) marketplaces = "&marketplaces=opensea"
        else if(x2y2) marketplaces = "&marketplaces=x2y2"
        else if(looksrare) marketplaces = "&marketplaces=looksrare"

        const {min, max} = sorts.priceFilter
        let priceFilter = ""
        if(sorts.buyNow) priceFilter = "&priceFilter=ETH,0,"
        if(min) priceFilter = `&priceFilter=ETH,${min},`
        if(max) priceFilter = `&priceFilter=ETH,0,${max}`
        if(max && min) priceFilter = `&priceFilter=ETH,${min},${max}`

        // let url = `https://api.gomu.co/rest/nfts/by-contract?limit=100&includeLastTransfer=false&contractAddress=${address}&sortBy=${sortMapping[sorts.sortBy]}${priceFilter}${marketplaces}`
        let url = `https://api.reservoir.tools/tokens/v5?collection=${address}&sortBy=floorAskPrice&sortDirection=asc&limit=50&includeTopBid=false&includeAttributes=false&includeQuantity=false&includeDynamicPricing=false&normalizeRoyalties=false`

        let data = await fetch(url)
        data = (await data.json()).tokens

        console.log(data)
        setItems(data)
        setLoadingItems(false)
    }
    //





    useEffect(()=>{
        if(address){
            getWatchListCollections("collection", address, setIsWatchList)
            getInfo()
        }
    }, [address])

    async function getInfo(){
        try{
            setLoadingCollection(true)
            let data = await fetch(`${baseUrl}/collectionInfo/${address}`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": localStorage.jsonwebtoken
                }
            })
            data = await data.json()
            const {slug} = data

            let openseaData = await fetch(`https://api.opensea.io/api/v1/collection/${slug}`)
            openseaData = (await openseaData.json()).collection

            const royalties = openseaData?.dev_seller_fee_basis_point || data?.royalties?.bps || ""
            const attributes = openseaData?.traits
            const createdDate = openseaData?.created_date
            const marketCap = openseaData?.stats?.market_cap
            const avgPrice = openseaData?.stats?.average_price
            const owners = openseaData?.stats?.num_owners
            const daySales = openseaData?.stats?.one_day_sales
            const totalSales = openseaData?.stats?.total_sales

            data["attributes"] = attributes
            data["collectionRoyalties"] = royalties 
            data["createdAt"] = createdDate
            data["marketCap"] = marketCap 
            data["avgPrice"] = avgPrice 
            data["ownerCount"] = owners 
            data["oneDaySales"] = daySales 
            data["totalSales"] = totalSales 

            console.log(data, openseaData)
            setCollectionInfo(data)
            setLoadingCollection(false)
        }
        catch(err){
            console.error(err)
        }

    }




    function expandDetails(e){
        if(extra){
            document.querySelector(".collection-info-boxes2").style.animation = "out 1.1s"
            setTimeout(()=>setExtra((oldValue) => !oldValue), 1000)
        }
        else{
            setExtra((oldValue) => !oldValue)
        }
        document.querySelectorAll(".collection-info-box2").forEach(element => {
            element.classList.toggle("display-extra-info")
        }); 
        document.querySelector(".banner-image").classList.toggle("expand")
        e.target.classList.toggle("rotate")
    }

    function changeCollectionSection(e){

        document.querySelectorAll(".single-collection-section").forEach(el =>{
            el.classList.remove("selected")
        })
        e.currentTarget.classList.add("selected")

        const section = e.currentTarget.getAttribute("section")
        setSection(section)
    }

    function listingsItems(){
        const {onSaleCount, tokenCount} = collectionInfo
        let data = "- - -"
        if(onSaleCount && tokenCount){
            data = `${onSaleCount} / ${tokenCount} (${getPercentage(onSaleCount, tokenCount)}%)`
        }
        return data
    }

    function copyAddress(){
        copy(address)
        setCopyState({value: "Copied"})
        setTimeout(()=>{
            setCopyState({value: "Copy"})
        }, 700)
    }

    function handleHoverCopy(hover){
        const el = document.querySelector(".collection-address-copy-btn")
            if(hover){
                el.classList.add("active")
                el.classList.remove("inactive")
            } 
            else{
                setCopyState({value: "Copy"})
                el.classList.remove("active")
                el.classList.add("inactive")
            } 
    }

    return (

    <>
        <div className='collection-info-container'>
            <div className='banner-image' style={{backgroundImage: `url(${collectionInfo.banner})`}}></div>
            <hr style={{border: "1.5px solid grey", backgroundColor: "grey"}}/>
            
            <div className='infos'>
                {
                    loadingCollection ? 
                    <>
                    <div className='collection-info-image'>
                        <Loader className={"collection-info-image-loader"}/>
                    </div>
                    <div className="loading-texts">
                        <div>
                            <Loader />
                        </div>
                        <div>
                            <Loader />
                        </div>
                        <div>
                            <Loader />
                        </div>
                    </div>
                    </>
                    :
                    <>
                    <img className='collection-info-image' src={collectionInfo.image || questionImage}/>
                    <div className='collection-info-name'>
                        <div>{collectionInfo.name || "---"}</div>
                        <img onClick={isWatchList ? () => removeFromWatchList("collection", address, setIsWatchList) : ()=> addToWatchList("collection", address, setIsWatchList)} className='starWatchlist' src={isWatchList ? fullStar : emptyStar}/>
                    </div>
                    <div className='collection-address-copy' onClick={copyAddress} onMouseOver={() => handleHoverCopy(true)} onMouseOut={() => handleHoverCopy(false)}>
                        <div>{formatContractAddress(address)}</div>
                        <div className='collection-address-copy-btn inactive'>{copyState.value}</div>
                        <i class="fa-solid fa-clipboard"></i>
                    </div>

                    <div className='flex-normal'>
                        <div className='collection-info-royalties'>
                            <i className="fa-solid fa-wallet"></i>
                            <div>{collectionInfo?.collectionRoyalties / 100}% Royalties</div>
                            <img style={{width: "15px", marginLeft: "5px"}} src={opensea}></img>
                        </div>
                    </div>
                    </>
                }



                <div className='collection-info-description'>

                    <b>Collection description: </b>
                    {
                        loadingCollection ? 
                            <Loader />
                        :
                        <>
                            <span className='low-opacity-text'>{collectionInfo.description || "There is no description available for this collection."}</span>
                        </>
                    }
                </div>
                
                <div className='links'>
                    {<a href={`https://etherscan.io/address/${address}`}  target={"_blank"}><img src={etherscan} alt="" /></a>}
                    {collectionInfo.slug && <a href={`https://opensea.io/collection/${collectionInfo.slug}`} target={"_blank"}><img src={opensea} alt="" /></a>}
                    {<a href={`https://x2y2.io/collection/${address}/items`} target={"_blank"}><img src={x2y2} alt="" /></a>}
                    {<a href={`https://looksrare.org/collections/${address}?queryID=2d673d7e77b4e27a2680a6d16a740a74`} target={"_blank"}><img src={looksRare} alt="" /></a>}
                    {<a href={`https://www.gem.xyz/collection/${address}/`} target={"_blank"}><img src={gem} alt="" /></a>}
                    {collectionInfo.externalUrl && <a href={`${collectionInfo.externalUrl}`} target={"_blank"}><img src={www} alt="" /></a>}
                    {collectionInfo.twitterUsername && <a href={`https://twitter.com/${collectionInfo.twitterUsername}`} target={"_blank"}><img src={twitter} alt="" /></a>}
                    {collectionInfo.discordUrl && <a href={`${collectionInfo.discordUrl}`} target={"_blank"}><img src={discord} alt="" /></a>}
                </div>
                
                { !loadingCollection &&
                <div className='collection-info-created-at'>
                    Creation date: 
                    <span className='low-opacity'> {collectionInfo.createdAt ? formatTime(collectionInfo.createdAt) : "- - -"}</span>
                </div>
                }
            </div>

            <div className='collection-info-boxes'>
                <div className='collection-info-box'>
                    <p>Listings / Items</p>
                        {
                            loadingCollection ?
                            <Loader />
                            :
                            <div>
                                <p>{listingsItems()}</p>
                            </div>
                        }
                </div>


                <div className='collection-info-box'>
                    <p>Floor price</p> 
                        {
                            loadingCollection ?
                            <Loader />
                            :
                            <div>
                                <i className="fa-brands fa-ethereum"></i>
                                <p>{roundPrice(collectionInfo.floorAsk?.price?.amount?.decimal) || "- - -"}</p>
                                {collectionInfo?.floorAsk?.price && <a href={""} target="_blank" className="collectioninfo-fp-image-link"><img src={getMarketplaceImage(collectionInfo?.floorAsk?.sourceDomain)} className="collectioninfo-fp-image"></img></a>}
                            </div>
                        }
                </div>

                <div className='collection-info-box'>
                    <p>Owners</p> 
                        {
                            loadingCollection ?
                            <Loader />
                            :
                            <div>
                                <p>{collectionInfo.ownerCount || "- - -"}</p>
                            </div>
                        }
                </div>

                <div className='collection-info-box'>
                    <p>Sales (24h)</p> 
                        {
                            loadingCollection ?
                            <Loader />
                            :
                            <div>
                                <p>{collectionInfo.oneDaySales && collectionInfo.oneDaySales || "- - -"}</p>
                            </div>
                        }
                </div>

                
                <div className='collection-info-box2'>
                    <p>Volume (24h)</p> 
                        {
                            loadingCollection ?
                            <Loader />
                            :
                            <div>
                                <i className="fa-brands fa-ethereum"></i>
                                <p>{collectionInfo.volume && roundPrice(collectionInfo.volume["1day"]) || "- - -"}</p>
                            </div>  
                        }
                </div>



            </div>

            {extra && <div className='collection-info-boxes2'>
                <div className='collection-info-box2'>
                    <p>Top bid</p>
                        {
                            loadingCollection ?
                            <Loader />
                            :
                            <div>
                                <i className="fa-brands fa-ethereum"></i>
                                <p>{roundPrice(collectionInfo.topBid?.price?.amount?.decimal) || "- - -"}</p>
                                {collectionInfo?.topBid?.price && <a href={""} target="_blank" className="collectioninfo-fp-image-link"><img src={getMarketplaceImage(collectionInfo?.topBid?.sourceDomain)} className="collectioninfo-fp-image"></img></a>}
                            </div>
                        }
                </div>

                <div className='collection-info-box2'>
                    <p>Market cap</p> 
                        {
                            loadingCollection ?
                            <Loader />
                            :
                            <div>
                                <i className="fa-brands fa-ethereum"></i>
                                <p>{collectionInfo.marketCap ? Math.round(collectionInfo.marketCap) : "- - -"}</p>
                            </div>
                        }
                </div>

                <div className='collection-info-box2'>
                    <p>Average price</p> 
                        {
                            loadingCollection ?
                            <Loader />
                            :
                            <div>
                                <i className="fa-brands fa-ethereum"></i>
                                <p>{collectionInfo.avgPrice ? roundPrice(collectionInfo.avgPrice) : "- - -"}</p>
                            </div>
                        }
                </div>

                <div className='collection-info-box'>
                    <p>Total volume</p>
                        {
                            loadingCollection ?
                            <Loader />
                            :
                            <div>
                                <i className="fa-brands fa-ethereum"></i>
                                <p>{roundPrice(collectionInfo.volume?.allTime) || "- - -"}</p>
                            </div>
                        }
                </div>

                <div className='collection-info-box2'>
                    <p>Total sales</p>
                        {
                            loadingCollection ?
                            <Loader />
                            :
                            <div>
                                <p>{collectionInfo.totalSales || "- - -"}</p>
                            </div>
                        }
                </div>

            </div>}
            
            <i onClick={(e) => expandDetails(e)} className="fa-solid fa-chevron-down info-arrow"></i>
        </div>

        <div className='collection-sections'>
            <div section="items" className='selected single-collection-section' onClick={e => changeCollectionSection(e)} >Items</div>
            <div section="liveview" onClick={e => changeCollectionSection(e)} className="single-collection-section flex-15"><p>Live view</p><LivePulsing /></div>
            <div section="activity" onClick={e => changeCollectionSection(e)} className="single-collection-section">Activity</div>
            <div section="charts" onClick={e => changeCollectionSection(e)} className="single-collection-section">Charts</div>
            <div section="leaderboard" onClick={e => changeCollectionSection(e)} className="single-collection-section">Leaderboard</div>
        </div>

        <Section section={section} collectionInfo={collectionInfo} setItems={setItems} address={address} items={items} sorts={sorts} setSorts={setSorts} loadingItems={loadingItems} setLoadingItems={setLoadingItems} buyNowChecked={buyNowChecked} setBuyNowChecked={setBuyNowChecked}/>
    </>

    )
}


const Section = ({section, collectionInfo, address, items, setItems, sorts, setSorts, loadingItems, setLoadingItems, buyNowChecked, setBuyNowChecked})=>{
    if(section === "items"){
        return <Items address={address} items={items} setItems={setItems} sorts={sorts} setSorts={setSorts} loadingItems={loadingItems} setLoadingItems={setLoadingItems} buyNowChecked={buyNowChecked} setBuyNowChecked={setBuyNowChecked} collectionInfo={collectionInfo}/>
    }
    else if(section === "liveview"){
        return <LiveView address={address} items={items} setItems={setItems} sorts={sorts} setSorts={setSorts} loadingItems={loadingItems} setLoadingItems={setLoadingItems} buyNowChecked={buyNowChecked} setBuyNowChecked={setBuyNowChecked} collectionInfo={collectionInfo} collectionImage={collectionInfo?.image}/>
    }
    else if(section === "activity"){
        return <Activity />
    }
    else if(section === "charts"){
        return <Charts />
    }
    else if(section === "leaderboard"){
        return <Leaderboard />
    }
}

const Loader = ({className}) => {
    let borderRadius = "6px"
    if(className === "collection-info-image-loader") borderRadius = "50%"

    return(
        <SkeletonTheme baseColor="#202020" highlightColor="#4444" borderRadius={borderRadius}>
            <Skeleton count={1} children={Box} className={className}/>
        </SkeletonTheme>
    )
    // return <div className='spinner'><svg width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle></svg></div>
}



const Box = ({children}) => {
    return(
        <span style={{marginTop: "10px"}}>
            {children}
        </span>
    )
}


export default Collection