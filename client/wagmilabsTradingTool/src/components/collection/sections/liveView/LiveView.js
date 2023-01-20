import { Button } from '@chakra-ui/react'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { roundPrice } from '../../../../utils/formats/formats'

import moment from "moment"

import "./liveview.css"

// websocket

import websocket from 'websocket';

// images

import etherscan from "../../../../assets/etherscan.svg"
import opensea from "../../../../assets/opensea.svg"
import getMarketplaceImage from '../../../../utils/marketplaceImageMapping'
import { SocketContext } from '../../../../context/SocketContext'

// utils

import { formatTime } from '../../../../utils/formats/formats'


const saleHashes = []

const LiveView = ({address, collectionImage}) => {


    const socket = useContext(SocketContext)

    const [listings, setListings] = useState([])
    const [sales, setSales] = useState([])
    const [refreshDate, setRefreshDate] = useState()

    useEffect(()=>{
        fetchListings()
        fetchSales()


        socket.emit("joinSales", address.toLowerCase())
        socket.emit("joinListings", address.toLowerCase())


        socket.on("sale", saleData => {

            console.log("new sale")
            
            const {tokenId, tokenAddress, timestamp, marketplace, hash, value} = saleData
            const {name, image} = saleData?.tokenInfo
            if(tokenAddress.toLowerCase() === address.toLowerCase()){
                setSales(oldSales => [{name: name, token_id: tokenId, image_url: image, eth_price: value, exchange_name: marketplace, timestamp, liveSale: true, hash}, ...oldSales])
            }
        })


        socket.on("listing", listingData => {

            const {contractAddress, tokenId, price, image, name, timestamp} = listingData.data
            const {marketplace} = listingData

            const dataObj = {
                criteria: {
                    data: {
                        token: {
                            name,
                            tokenId,
                            image
                        }
                    }
                },
                source: {
                    name: marketplace
                },
                createdAt: timestamp * 1000,
                price: {
                    amount: {
                        decimal: price
                    }
                }
            }

            console.log(listingData)

            if(contractAddress.toLowerCase() === address.toLowerCase()){
                setListings(oldListings => [dataObj, ...oldListings])
            }
        })

        const dateInterval = setInterval(() => setRefreshDate(crypto.randomUUID()), 1000)

        return () => {
            // clearInterval(interval);
            socket.emit("leaveSales", address.toLowerCase())
            socket.emit("leaveListings", address.toLowerCase())
            clearInterval(dateInterval)
        }
    }, [])


    async function fetchListings(){
        let listings = await fetch(`https://api.reservoir.tools/orders/asks/v4?contracts=${address}&native=false&includePrivate=false&includeCriteriaMetadata=true&normalizeRoyalties=false&sortBy=createdAt&limit=50`)
        listings = (await listings.json()).orders
        console.log(listings)
        setListings(listings)
    }

    async function fetchSales(){
        let data = await fetch("https://api.transpose.io/sql", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': 'C4fApvFQlRelzwhzM0BW7loRbVPLt3E9',
            },
            body: JSON.stringify({
                sql: `SELECT * FROM ethereum.nft_sales s INNER JOIN ethereum.nfts n ON (s.contract_address, s.token_id) = (n.contract_address, n.token_id) WHERE s.contract_address = '${address}' AND s.usd_price > 0 ORDER BY timestamp desc  LIMIT 100`
            })
        })
        data = (await data.json()).results
        // console.log(data)
        setSales(data)
    }

    const listingsMapping = useMemo(()=> listings.map(listing => {
        
        const {name, image, tokenId} = listing?.criteria?.data?.token
        const readableValue = listing?.price?.amount?.decimal
        const marketplace = listing?.source?.name
        const listingTime = new Date(listing?.createdAt).getTime()
        const formatListingTime = formatTime(listingTime)
        

        const marketplaceImg = getMarketplaceImage(marketplace)

        const id = crypto.randomUUID()

        return(
            <div className='live-view-single-listing-item' key={id}>
                <div className='live-view-listing-container'>
                    <img src={image} className="live-view-listing-image"/>
                    <div>
                        <p>{name || tokenId}</p>
                        <p className='live-view-listing-time'>{formatListingTime}</p>
                    </div>
                </div>

                <div className='flex-col-left'>
                    <p>{roundPrice(readableValue)} ETH</p>
                    <div className='live-view-listing-marketplace-container'>
                        <img src={marketplaceImg} className="live-view-listing-marketplace"></img>
                        <Button colorScheme={"blue"} className='live-view-buy'>Buy</Button>
                    </div>
                </div>
            </div>
        )
    }), [listings, refreshDate])

    const salesMapping = useMemo(()=> sales.map((sale, index) => {
            const {eth_price, liveSale, token_id} = sale

            const hash = sale?.hash || sale?.transaction_hash
            const name = sale?.name || token_id
            const image = sale?.image_url || collectionImage
            const marketplaceName = sale?.exchange_name
            const saleTime = new Date(sale?.timestamp).getTime()
            
            const marketplaceImage = getMarketplaceImage(marketplaceName)
            
            let time = formatTime(saleTime)

            const randomUUID = crypto.randomUUID()
            return(
                <div key={randomUUID} className={`live-view-single-sale-item ${liveSale ? saleHashes.includes(hash) ? "" : "animate" : ""}`}>
                    <div className='live-view-sale-container'>
                        <img src={image} className="live-view-sale-image"/>
                        <div>
                            <p>{name}</p>
                            <p className='live-view-sale-time'>{time}</p>
                        </div>
                    </div>
    
                    <div className='flex-col-left'>
                        <p>{roundPrice(eth_price)} ETH</p>
                        <div className='live-view-sales-logos'>
                            <img src={marketplaceImage}/>
                            <a href={`https://etherscan.io/tx/${hash}`} target="_blank"><img src={etherscan}/></a>
                        </div>
                    </div>
                    {(() => {!saleHashes.includes(hash) && liveSale && saleHashes.push(hash)})()}
                </div>
            )
    }), [sales, refreshDate])

  return (
    <div className='live-view-container'>
        <section className='live-view-section'>
            <div className='live-view-listings-container'>
                <p className='live-view-listing-text'>Listings</p>

                <div className='live-view-listing-items'>
                    {
                        listingsMapping
                    }
                </div>
            </div>

            <div className='live-view-sales-container'>
                <p className='live-view-sale-text'>Sales</p>

                <div className='live-view-sale-items'>
                    {
                        salesMapping
                    }
                </div>
            </div>
        </section>
    </div>
  )
}

export default LiveView