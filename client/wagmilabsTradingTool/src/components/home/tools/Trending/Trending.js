import React, { useEffect, useMemo, useRef, useState } from 'react'
import baseUrl from "../../../../variables/baseUrl"
import "./trending.css"
import question from "../../../../assets/question.png"
import times from "./times"

import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import useFirstRender from '../../../../custom-hooks/useFirstRender'
import moment from 'moment'


import notFound from "../../../../assets/notFound.svg"

const defaultTimeFrame = "1H"

const Trending = ({tool, timeFrame, setTimeFrame, resetTime}) => {
  
  const firstRender = useFirstRender()


  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(false)


  const time = times[timeFrame]
  const timeRef = useRef(time)

  const [sort, setSort] = useState({name: "sales", type: "desc"})
  const sortRef = useRef(sort)


  useEffect(()=>{
    sortRef.current = sort
  }, [sort])


  useEffect(()=>{
    if(firstRender && timeFrame !== defaultTimeFrame) return
    timeRef.current = time
    getTrending(true)
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
    const refreshInterval = setInterval(getTrending, 5000)

    return () => {
      clearInterval(refreshInterval)
    }
  }, [])

  async function getTrending(loading){
    if(!loading) loading = false
    setLoading(loading)

    let data = await fetch(`${baseUrl}/trending/${timeRef.current}`, {
      headers: {
        "x-auth-token": localStorage.jsonwebtoken
      }
    })
    data = (await data.json()).data
    setTimeout(()=>{
      setLoading(false)
    }, 300)

    sortData(data)
  }



  function sortData(data){

    let statsToSort
    if(data) statsToSort = data
    else statsToSort = stats

    const {name, type} = sortRef.current

    switch(name){
      case "floor-price":
        const filteredFloor = statsToSort.sort((a, b) => {
          if(type === "asc") return a.floor_price - b.floor_price
          else if(type === "desc") return b.floor_price - a.floor_price
        })
        setStats([...filteredFloor])
        break
      case "sales":
        const filteredSales = statsToSort.sort((a, b) => {
          if(type === "asc") return a.rightSales - b.rightSales
          else if(type === "desc") return b.rightSales - a.rightSales
        })
        setStats([...filteredSales])
        break
      case "volume":
        const filteredVolume = statsToSort.sort((a, b) => {
          if(type === "asc") return a.volume - b.volume
          else if(type === "desc") return b.volume - a.volume
        })
        setStats([...filteredVolume])
        break
      case "supply":
        const filteredSupply = statsToSort.sort((a, b) => {
          if(type === "asc") return a.totalSupply - b.totalSupply
          else if(type === "desc") return b.totalSupply - a.totalSupply
        })
        setStats([...filteredSupply])
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
    const {floor_price, image, contractAddress, name, totalSupply, creationDate} = stat
    const sales = stat.rightSales
    const volume = stat.volume
    const {volumeStats} = stat
    const {floorStats} = stat

    
    const creationDay = moment(creationDate).fromNow()
    
      return (
        <tr onClick={ () =>  window.open(`/collection/${contractAddress}`, '_blank')} className='single-collection-container' key={index}>
          <td className='image-name-container'>
            <img src={image || question} className="trending-image"></img>
            <div className='minting-name-date'>
              <p className='trending-name'>{name || "- - -"}</p>
              <p className='trending-created-date'>{creationDay}</p>
            </div>
          </td>
          <td >
            <div className='trending-floor-price'>
              <i className="fa-brands fa-ethereum"></i>
              <p>{floor_price}</p>
            </div>
          </td>
          <td className='trending-chart-floor-price'>
            <div className='fp-chart'>
              {
                floorStats &&
                  <HighchartsReact className="chart" highcharts={Highcharts} options={{
                    series: [{
                      name: "Floor price",
                      data: [ floorStats["30day"] || 0, floorStats["7day"] || 0,floorStats["1day"] || 0],
                    }],
                    xAxis: {
                      categories: ["30 DAYS", "7 DAYS", "1 DAY"],
                      visible: false
                    },
                    yAxis: {
                      visible: false
                    },
                    legend: {
                      enabled: false
                    },
                    title: {
                      text: ''
                    },
                    chart: {
                      type: "spline",
                      width: 160,
                      height: 80,
                      backgroundColor: "transparent",
                      borderRadius: 10
                    },
                    tooltip: {
                      followPointer: true,
                      hideDelay: 200,
                      outside: true,
                    }
                  }}/>
              }
            </div>
          </td>
          <td className="trending-sales filtered">
            <div className='trending-sales-pending'>
              <p>{sales}</p>

              {/* { currentPendingTxs !== 0 ?
                  <div className='pending'>
                    <span class="iconfont global-loading"></span>
                    <span class="quantity">{currentPendingTxs}</span>
                  </div>
                  :
                  <div className='pending'>
                  </div>
              } */}
            </div>
          </td>
          <td>
            <div className='trending-volume'>
              <i className="fa-brands fa-ethereum"></i>
              <p>{Math.round(volume * 1000) / 1000}</p>
            </div>
          </td>
          <td className='trending-chart-volume'>
            <div className='volume-chart'>
              {volumeStats &&
                <HighchartsReact highcharts={Highcharts} options={{
                  series: [{
                    name: "Volume",
                    data: [ volumeStats["1day"] || 0, volumeStats["7day"] || 0, volumeStats["30day"] || 0],
                    borderRadius: 5
                  }],
                  xAxis: {
                      categories: ["1 DAY", "7 DAYS", "30 DAYS"],
                      visible: false
                    },
                    yAxis: {
                        visible: false
                  },
                  legend: {
                    enabled: false
                  },
                  title: {
                    text: ''
                  },
                  chart: {
                    type: "column",
                    width: 160,
                    height: 80,
                    backgroundColor: "transparent",
                  },
                  tooltip: {
                    followPointer: true,
                    followTouchMove: true,
                    hideDelay: 200,
                    outside: true,
                  }
                }}/>
              }
            </div>
          </td>
          <td className='trending-supply'>
            <p>{totalSupply}</p>
          </td>
        </tr>
      )  
  }), [stats])

  return (
    <>
    <div className='table-container'>
      <table cellSpacing={0} className='trending-container'>
        <thead className='trending-details'>
          <tr>
            <th>
              {/* <div className='refresh'><i className="fa-solid fa-rotate reloadIcon" onClick={getTrending}></i></div> */}
              <p>Collection</p>
            </th>
            <th>
              <div onClick={(e) => changeSort(e, "floor-price")}>
                <p>Floor Price</p>
                <i className="fa-solid fa-caret-down arrow"></i>
              </div>
            </th>
            <th>
              <div>
                <p>Floor chart</p>
              </div>
            </th>
            <th>
            <div onClick={(e) => changeSort(e, "sales")}>
                <p className='nameSelected'>Sales</p>
                <i className="fa-solid fa-caret-down arrow selected rotate"></i>
              </div>
            </th>
            <th>
              <div onClick={(e) => changeSort(e, "volume")}>
                <p>Volume</p>
                <i className="fa-solid fa-caret-down arrow"></i>
              </div>
            </th>
            <th>
              <div>
                <p>Volume chart</p>
              </div>
            </th>
            <th>
              <div onClick={(e) => changeSort(e, "supply")}>
                <p>Supply</p>
                <i className="fa-solid fa-caret-down arrow"></i>
              </div>
            </th>
          </tr>
        {loading && <tr><td colSpan={7}><div className='loading'>Loading data   <svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle></svg>     </div></td></tr>}
        </thead>
        <tbody>
          {
            !loading &&
            stats.length === 0 ?
            
            <div className='trending-not-found'>
                <img src={notFound}/>
                <p>No collections found...</p>
            </div>
            :
            mappedStats
          }
        </tbody>
      </table>
    </div>
    </>
  )
}

export default Trending