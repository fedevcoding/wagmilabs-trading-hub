import React, { memo } from 'react'
import HighchartsReact from 'highcharts-react-official'
import HighCharts from 'highcharts'


const BubbleChart = memo(({ totalListings, totalSales, floorPrice }) => {


    const listingData = totalListings?.map(listing => listing.value <= floorPrice + 0.05 && [new Date(listing.timestamp * 1000), listing.value])
    const salesData = totalSales?.map(sale => sale.value <= floorPrice + 0.1 && [new Date(sale.timestamp), sale.value])

    const chartOptions = {
        series: [
            {
                type: "scatter",
                name: "Sales",
                data: salesData,
            },
            {
                type: "scatter",
                name: "Listings",
                data: listingData,
            },
        ],
        title: {
            text: "",
        },
        xAxis: {
            type: "datetime",
        },
        chart: {
            type: "spline",
            backgroundColor: "transparent",
            borderRadius: 10,
        },
        tooltip: {
            shared: true,
            hideDelay: 200,
            outside: false,
        },
    }

    return (
        <div>
            <HighchartsReact
                highcharts={HighCharts}
                options={chartOptions}
            />
        </div>
    )
})

export default BubbleChart