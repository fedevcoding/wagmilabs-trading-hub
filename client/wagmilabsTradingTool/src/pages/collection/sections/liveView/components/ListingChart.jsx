import React, { memo } from 'react'
import HighchartsReact from 'highcharts-react-official'
import HighCharts from 'highcharts'


const ListingChart = memo(({ listingChartObject }) => {

    const keys = Object.keys(listingChartObject)
    const values = Object.values(listingChartObject)

    const chartOptions = {
        series: [
            {
                data: values,
            },
        ],
        title: {
            text: "",
        },
        xAxis: {
            categories: keys,
        },
        chart: {
            type: "column",
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

export default ListingChart