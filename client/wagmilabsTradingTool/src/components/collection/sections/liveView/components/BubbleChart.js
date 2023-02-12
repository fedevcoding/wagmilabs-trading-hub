import React, { memo } from 'react'
import HighchartsReact from 'highcharts-react-official'
import HighCharts from 'highcharts'


const BubbleChart = memo(({ totalListings, totalSales }) => {


    const listingData = totalListings?.map(listing => listing.value <= 0.2 && [listing.timestamp * 1000, listing.value])
    const salesData = totalSales?.map(sale => sale.value <= 0.4 && [sale.timestamp, sale.value])


    // salesData.forEach(list => {
    //     if (list[0] < 1670047363011) console.log(list)
    // })

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