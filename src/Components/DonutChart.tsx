import { DonutChartData } from '@/Utils/Global_variables'
import React from 'react'
import {Doughnut} from "react-chartjs-2"
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
} from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend, Title)

interface DonutChartProps{
    chartData: DonutChartData
    chartTitle: string
}

const DonutChart:React.FC<DonutChartProps> = ({chartData, chartTitle}) => {
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: chartTitle,
          },
        },
      };
    return (
        <Doughnut data={chartData} options={options}/>
    )
}

export default DonutChart
