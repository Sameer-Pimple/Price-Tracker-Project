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
                borderColor: 'rgb(37, 99, 235)', // Primary blue
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                }
            },
            title: {
                display: true,
                text: 'Price History',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false, // Better focus on price movement
                ticks: {
                    callback: function (value) {
                        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
                    }
                }
            },
            x: {
                grid: {
                    display: false // Cleaner look
                }
            }
        }
    };

    return <Line options={options} data={data} />;
};

export default PriceChart;
