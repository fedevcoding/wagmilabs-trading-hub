import React, { useEffect, useState, useMemo, useRef } from 'react'
import "./minting.css"
import times from "./times"
import baseUrl from '../../../../variables/baseUrl'

import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { roundPrice } from '../../../../utils/formats/formats'

import moment from "moment"
import useFirstRender from '../../../../custom-hooks/useFirstRender'

const defaultTimeFrame = "1H"

const Minting = ({tool, timeFrame, setTimeFrame, resetTime}) => {

  const firstRender = useFirstRender()

  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(false)

  const time = times[timeFrame]
  const timeRef = useRef(time)


  const [sort, setSort] = useState({name: "right-mints", type: "desc"})


  useEffect(()=>{
    if(firstRender && timeFrame !== defaultTimeFrame) return
    timeRef.current = time
    getMinting(true)
  }, [timeFrame])

  
  useEffect(()=>{
    resetTime(defaultTimeFrame)
    setTimeFrame(defaultTimeFrame)
  }, [tool])

  useEffect(()=>{
    stats && sortData()
  }, [sort])


  // refresh interval
  useEffect(()=>{
      const refreshInterval = setInterval(getMinting, 5000)
  
      return () => {
        clearInterval(refreshInterval)
      }
  }, [])
  


  async function getMinting(loading){
    if(!loading) loading = false
    setLoading(loading)

    let data = await fetch(`${baseUrl}/minting/${timeRef.current}`, {
      headers: {
        "x-auth-token": localStorage.jsonwebtoken
      }
    })
    data = (await data.json()).data
    setTimeout(()=>{
      setLoading(false)
    }, 300)

    console.log(data)
    // setStats(data)
    sortData(data)
  }



  function sortData(data){

    let statsToSort
    if(data) statsToSort = data
    else statsToSort = stats

    const {name, type} = sort

    switch(name){
      case "floor-price":
        const filteredFloor = statsToSort.sort((a, b) => {
          if(type === "asc") return a.floor_price - b.floor_price
          else if(type === "desc") return b.floor_price - a.floor_price
        })
        setStats([...filteredFloor])
        break
      case "mint-price":
        const filteredMintPrice = statsToSort.sort((a, b) => {
          if(type === "asc") return a.mintPrice - b.mintPrice
          else if(type === "desc") return b.mintPrice - a.mintPrice
        })
        setStats([...filteredMintPrice])
        break
      case "mint-volume":
        const filteredMintVolume = statsToSort.sort((a, b) => {
          if(type === "asc") return a.volume - b.volume
          else if(type === "desc") return b.volume - a.volume
        })
        setStats([...filteredMintVolume])
        break
      case "right-mints":
        const filteredRightMints = statsToSort.sort((a, b) => {
          if(type === "asc") return a.rightMints - b.rightMints
          else if(type === "desc") return b.rightMints - a.rightMints
        })
        setStats([...filteredRightMints])
        break
      case "unique-minters":
        const filteredUniqueMinters = statsToSort.sort((a, b) => {
          if(type === "asc") return a.uniqueMinters - b.uniqueMinters
          else if(type === "desc") return b.uniqueMinters - a.uniqueMinters
        })
        setStats([...filteredUniqueMinters])
        break
      case "total-mints":
        const filteredTotalMints = statsToSort.sort((a, b) => {
          if(type === "asc") return a.totalMints - b.totalMints
          else if(type === "desc") return b.totalMints - a.totalMints
        })
        setStats([...filteredTotalMints])
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


  const mappedStats = useMemo(()=> stats.map((stat, index) => {

    const {creationDate, image, contractAddress, name, totalMints, uniqueMinters, volume, floor_price, mintPrice, rightMints, slug} = stat

    const creationDay = moment(creationDate).fromNow()
    
      return (
        <tr onClick={ () =>  window.open(`/collection/${contractAddress}`, '_blank')} className='single-collection-container' key={index}>
          <td className='image-name-container'>
            <img src={image} className="minting-image"></img>
            <div className='minting-name-date'>
              <p className='minting-name'>{name || "- - -"}</p>
              <p className='minting-created-date'>{creationDay}</p>
            </div>
          </td>
          <td >
            <div className='minting-mint-price'>
              <i className="fa-brands fa-ethereum"></i>
              <p>{mintPrice ? roundPrice(mintPrice) : 0}</p>
            </div>
          </td>
          <td className='minting-chart-floor-price'>
            <div className='minting-floor-price'>
              <i className="fa-brands fa-ethereum"></i>
              <p>{floor_price ? roundPrice(floor_price) : 0}</p>
            </div>
          </td>
          <td className="minting-sales filtered">
            <div className='minting-right-mints'>
              {rightMints || "- - -"}
            </div>
          </td>
          <td>
            <div className='minting-volume'>
              <i className="fa-brands fa-ethereum"></i>
              <p>{volume ? roundPrice(volume) : "- - -"}</p>
            </div>
          </td>
          <td className='minting-chart-mint'>
            <div className='mint-chart'>
              
            </div>
          </td>
          <td className='minting-unique-minters'>
            <p>{uniqueMinters || "- - -"}</p>
          </td>
          <td className='minting-total-mints'>
            <p>{totalMints || "- - -"}</p>
          </td>
        </tr>
      )  
  }), [stats])


  return (
    <>
    <div className='table-container'>
      <table cellSpacing={0} className='minting-container'>
        <thead className='minting-details'>
          <tr>
            <th>
              <p>Collection</p>
            </th>
            <th>
              <div onClick={(e) => changeSort(e, "mint-price")}>
                <p>Mint price</p>
                <i className="fa-solid fa-caret-down arrow"></i>
              </div>
            </th>
            <th>
            <div onClick={(e) => changeSort(e, "floor-price")}>
                <p>Floor price</p>
                <i className="fa-solid fa-caret-down arrow"></i>
              </div>
            </th>
            <th>
            <div onClick={(e) => changeSort(e, "right-mints")}>
                <p className='nameSelected'>Mints</p>
                <i className="fa-solid fa-caret-down arrow selected rotate"></i>
              </div>
            </th>
            <th>
              <div onClick={(e) => changeSort(e, "mint-volume")}>
                <p>Mint volume</p>
                <i className="fa-solid fa-caret-down arrow"></i>
              </div>
            </th>
            <th>
              <div>
                <p>Mint trend</p>
              </div>
            </th>
            <th>
              <div onClick={(e) => changeSort(e, "unique-minters")}>
                <p>Unique minters</p>
                <i className="fa-solid fa-caret-down arrow"></i>
              </div>
            </th>
            <th>
              <div onClick={(e) => changeSort(e, "total-mints")}>
                <p>Total mints</p>
                <i className="fa-solid fa-caret-down arrow"></i>
              </div>
            </th>
          </tr>
          {loading && <tr><td colSpan={8}><div className='loading'>Loading data   <svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle></svg>     </div></td></tr>}
          </thead>
          <tbody>
          {
            mappedStats
          }
        </tbody>

      </table>
    </div>
    </>
  )
}

export default Minting