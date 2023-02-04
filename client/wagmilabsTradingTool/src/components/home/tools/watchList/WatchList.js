import React, {useState, useEffect, useMemo} from 'react'
import baseUrl from "../../../../variables/baseUrl"
import "./watchlist.css"

import notFound from "../../../../assets/notFound.svg"

import times from './times'

import useFirstRender from '../../../../custom-hooks/useFirstRender'
import { placeholderImage } from '../../../../utils/images'

import {LazyLoadImage} from 'react-lazy-load-image-component';


const WatchList = ({tool, timeFrame, setTimeFrame, resetTime}) => {

    const firstRender = useFirstRender()


    const [collections, setCollections] = useState([])
    const [loading, setLoading] = useState(false)
    
    const [sort, setSort] = useState({name: "volume", type: "desc"})


    useEffect(()=>{
        resetTime("24H")
        setTimeFrame("24H")
    }, [tool])

    useEffect(()=>{
        if(loading){
            document.querySelector(".reloadIcon").classList.add("rotatingReloader")
        }
        else{
            document.querySelector(".reloadIcon").classList.remove("rotatingReloader")
        }
    }, [loading])

    useEffect(()=>{
        collections && sortData()
    }, [sort])

    useEffect(()=>{
        getWatchListCollections()
    }, [timeFrame])



    const time = times[timeFrame]


    async function getWatchListCollections(){
        try{
            setLoading(true)

            let collectionData = await fetch(`${baseUrl}/watchlistCollections`, {
                headers: {
                    "COntent-Type": "application/json",
                    "x-auth-token": localStorage.jsonwebtoken
                }
            })
            collectionData = await collectionData.json()
            
            const {watchListCollections} = collectionData

            sortData(watchListCollections)
            setLoading(false)
        }
        catch(err){
            console.error(err)
            sortData([])
            setLoading(false)
        }
    }





    
    function sortData(data){

        let statsToSort
        if(data) statsToSort = data
        else statsToSort = collections

        const {name, type} = sort

        switch(name){
        case "floor-price":
            const filteredFloor = statsToSort.sort((a, b) => {
            if(type === "asc") return a.floorAsk?.price?.amount?.decimal - b.floorAsk?.price?.amount?.decimal
            else if(type === "desc") return b.floorAsk?.price?.amount?.decimal - a.floorAsk?.price?.amount?.decimal
            })
            setCollections([...filteredFloor])
            break
        case "volume":
            const filteredVolume = statsToSort.sort((a, b) => {
            if(type === "asc") return a.volume[time] - b.volume[time]
            else if(type === "desc") return b.volume[time] - a.volume[time]
            })
            setCollections([...filteredVolume])
            break
        case "total-volume":
            const filteredTotalVolume = statsToSort.sort((a, b) => {
            if(type === "asc") return a.volume?.allTime - b.volume?.allTime
            else if(type === "desc") return b.volume?.allTime - a.volume?.allTime
            })
            setCollections([...filteredTotalVolume])
            break
        case "top-bid":
            const filteredTopBid = statsToSort.sort((a, b) => {
            if(type === "asc") return a.topBid?.price?.amount?.decimal - b.topBid?.price?.amount?.decimal
            else if(type === "desc") return b.topBid?.price?.amount?.decimal - a.topBid?.price?.amount?.decimal
            })
            setCollections([...filteredTopBid])
            break
            case "listings":
                const filteredListings = statsToSort.sort((a, b) => {
            if(type === "asc") return a.onSaleCount - b.onSaleCount
            else if(type === "desc") return b.onSaleCount - a.onSaleCount
            })
            setCollections([...filteredListings])
            break
        }
    }


    function changeSort(e, sortName){
        const {name, type} = sort
        let sortingType = "desc"

        if(name === sortName && type === "desc") sortingType = "asc"
        
        setArrows(e)
        setSort({name: sortName, type: sortingType})
    }

    function setArrows(e){
        document.querySelectorAll(".arrow").forEach(a => { 
        if(e.currentTarget.children[1] == a){
            return
        }
        a.classList.remove("rotate")
        a.classList.remove("selected")
        a.previousElementSibling.classList.remove("nameSelected")
        })
        e.currentTarget.children[1].classList.add("selected")
        e.currentTarget.children[1].classList.toggle("rotate")
        e.currentTarget.children[1].previousElementSibling.classList.add("nameSelected")
    }



    const collectionsMapping = useMemo(()=> collections.map((collection, index) => {
        const {name, image, tokenCount, onSaleCount} = collection
        const volume = collection?.volume[time]
        const totalVolume = collection?.volume?.allTime
        const contractAddress = collection?.id
        const floorPrice = collection?.floorAsk?.price?.amount?.decimal
        const bidValue = collection?.topBid?.price?.amount?.decimal
        
        return(
            <>
                <tr className='single-collection-container' key={index} onClick={()=> window.open(`/collection/${contractAddress}`, "_blank")}>
                    <td>
                        <div className='image-name-container'>
                            <LazyLoadImage src={image} className="owned-image" effect='blur' placeholderSrc={placeholderImage}/>

                            <p className='owned-name'>{name}</p>
                        </div>
                    </td>
                    <td>
                        <div className='owned-floor-price'>
                            <i className="fa-brands fa-ethereum"></i>
                            <p>{floorPrice || "---"}</p>
                        </div>
                    </td>
                    <td>
                        <div className='owned-floor-price'>
                            <i className="fa-brands fa-ethereum"></i>
                            <p>{volume || "---"}</p>
                        </div>
                    </td>
                    <td>
                        <div className='owned-floor-price'>
                            <i className="fa-brands fa-ethereum"></i>
                            <p>{totalVolume || "---"}</p>
                        </div>
                    </td>
                    <td>
                        <div className='owned-floor-price'>
                            <i className="fa-brands fa-ethereum"></i>
                            <p>{bidValue || "---"}</p>
                        </div>
                    </td>
                    <td>
                        <p>{onSaleCount} / {tokenCount}</p>
                    </td>
                </tr>
            </>
        )
    }), [collections])


  return (
    <>
    <div className='table-container'>
        <table cellSpacing={0} className="owned-container">
            <thead className='owned-details'>
                <tr>
                    <th>
                        <div className='refresh'><i onClick={getWatchListCollections} className="fa-solid fa-rotate reloadIcon"></i></div>
                        <p>Collection</p>
                    </th>
                    <th>
                        <div onClick={(e) => changeSort(e, "floor-price")}>
                            <p>Floor price</p>
                            <i className="fa-solid fa-caret-down arrow"></i>
                        </div>
                    </th>
                    <th>
                        <div onClick={(e) => changeSort(e, "volume")}>
                            <p className='nameSelected'>Volume</p>
                            <i className="fa-solid fa-caret-down arrow selected rotate"></i>
                        </div>
                    </th>
                    <th>
                        <div onClick={(e) => changeSort(e, "total-volume")}>
                            <p>Total volume</p>
                            <i className="fa-solid fa-caret-down arrow"></i>
                        </div>
                    </th>
                    <th>
                        <div onClick={(e) => changeSort(e, "top-bid")}>
                            <p>Top bid</p>
                            <i className="fa-solid fa-caret-down arrow"></i>
                        </div>
                    </th>
                    <th>
                        <div onClick={(e) => changeSort(e, "listings")}>
                            <p>Listings/supply</p>
                            <i className="fa-solid fa-caret-down arrow"></i>
                        </div>
                    </th>
                </tr>
            {loading && <tr><td colSpan={7}><div className='loading'>Loading data   <svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle></svg>     </div></td></tr>}
            </thead>

            <tbody>
                {   
                    !loading &&
                        collections.length === 0 ?
                        
                        <div className='watchlist-not-found'>
                            <img src={notFound}/>
                            <p>No collections found...</p>
                        </div>
                        :
                        collectionsMapping
                }
            </tbody>
        </table>
    </div>
    </>
  )
}

export default WatchList