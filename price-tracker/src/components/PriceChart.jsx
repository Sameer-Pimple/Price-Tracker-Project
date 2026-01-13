import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const PriceChart = ({ priceHistory }) => {
    if (!priceHistory || priceHistory.length === 0) {
        return <div>No price history available.</div>;
    }

    const data = {
        labels: priceHistory.map(item => item.date),
        datasets: [
            {
                label: 'Price (INR)',
                data: priceHistory.map(item => item.price),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Price History',
            },
        },
    };

    return <Line options={options} data={data} />;
};

export default PriceChart;
