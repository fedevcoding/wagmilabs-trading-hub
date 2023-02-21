import React, { memo } from 'react'
import HighchartsReact from 'highcharts-react-official'
import HighCharts from 'highcharts'


const BubbleChart = memo(({ totalListings, totalSales, floorPrice }) => {

    let maxPrice = 0
    if (floorPrice < 0.005) maxPrice = 0.04
    else if (floorPrice < 0.01) maxPrice = 0.08
    else if (floorPrice < 0.05) maxPrice = 0.2
    else if (floorPrice < 0.1) maxPrice = 0.4
    else if (floorPrice < 0.2) maxPrice = 0.5
    else if (floorPrice < 0.4) maxPrice = 0.7
    else if (floorPrice < 0.7) maxPrice = 1.1
    else if (floorPrice < 1) maxPrice = 1.4
    else if (floorPrice < 5) maxPrice = 8
    else if (floorPrice < 10) maxPrice = 18

    const listingData = totalListings?.map(listing => listing.value < maxPrice && ({ x: listing.timestamp * 1000, y: listing.value, name: listing.name, image: listing.image }))
    const salesData = totalSales?.map(sale => sale.value < maxPrice && ({ x: sale.timestamp, y: sale.value, name: sale.name, image: sale.image }))


    const chartOptions = {
        series: [
            {
                type: "scatter",
                name: "Sales",
                turboThreshold: 2500,
                data: salesData,
                tooltip: {
                    pointFormat: `
                    <div>
                        <p>{new Date(point.x)}</p>
                        <p>{point.name}</p>
                        <img class="bubble-chart-image" src={point.image} style={{width: 50px, height: 50px}} />
                    </div>
                    `,
                },
                marker: {
                    fillColor: "red",
                    lineColor: "#FFFFFF",
                    zIndex: 100,
                },

            },
            {
                type: "scatter",
                name: "Listings",
                data: listingData,
                turboThreshold: 2500,
                tooltip: {
                    pointFormat: `
                    <div>
                        <p>{new Date(point.x)}</p>
                        <p>{point.name}</p>
                        <img src={point.image} style={{width: 50px, height: 50px}} />
                    </div>
                    `,
                },
                marker: {
                    fillColor: "orange",
                    lineColor: "#FFFFFF",
                    zIndex: 90,
                },
            },
        ],
        plotOptions: {
            series: {
                marker: {
                    symbol: "circle",
                    radius: 4,
                },
            },
        },
        title: {
            text: "",
        },
        xAxis: {
            type: "datetime",
        },
        chart: {
            backgroundColor: "transparent",
            borderRadius: 10,
        },
        tooltip: {
            useHTML: true
        }
    }

    return (
        <div className='bubble-chart'>
            <HighchartsReact
                highcharts={HighCharts}
                options={chartOptions}
            />
        </div>
    )
})

export default BubbleChart