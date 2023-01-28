import React, { useEffect, useState } from 'react'
import baseUrl from "../../../../variables/baseUrl.js"
import { useParams } from 'react-router-dom';

import HighchartsReact from "highcharts-react-official"
import Highcharts from "highcharts"
import { roundPrice2 } from '../../../../utils/formats/formats.js';


import "./activity.css"
import moment from 'moment';

const Activity = ({address}) => {

  const [activityChartData, setActivityChartData] = useState({})
  const [loadingChart, setLoadingChart] = useState(true)



  useEffect(()=>{
    getChartData()
  }, [])

  async function getChartData(){
    setLoadingChart(true)
    
    let data = await fetch(`${baseUrl}/activityChart/${address}`, {
      headers: {
        "x-auth-token": localStorage.jsonwebtoken
      }
    })

    data = await data.json()

    console.log(data)

    const averagePrices = data.map(item => roundPrice2(item.averageprice))
    const volumes = data.map(item => roundPrice2(item.volume))
    const days = data.map(item => moment(item.day).format("DD/MM/YYYY"))
    const sales = data.map(item => item.sales)

    setActivityChartData({averagePrices: averagePrices, volumes: volumes, sales, days})
    setLoadingChart(false)
  }


  return (
    <>
    <div className='collection-activity-section'>
      <HighchartsReact className="activity-chart" highcharts={Highcharts} options={{
                      series: [{
                        type: 'column',
                        name: 'Volume',
                        data: activityChartData?.volumes,
                        yAxis: 1
                    }, {
                        type: 'spline',
                        name: 'Average price',
                        data: activityChartData?.averagePrices,
                    }],
                      xAxis: {
                        categories: activityChartData?.days
                      },
                      yAxis: [{
                          title: {
                              text: 'Million liters'
                          }
                      }, {
                          title: {
                              text: 'Million liters'
                          },
                          opposite: true
                      }],
                      legend: {
                      },
                      title: {
                        text: ''
                      },
                      chart: {
                        type: "spline",
                        backgroundColor: "transparent",
                        borderRadius: 10
                      },
                      tooltip: {
                        followPointer: true,
                        hideDelay: 200,
                        outside: true,
                      }
      }}/>
    </div>
    </>
  )
}

export default Activity