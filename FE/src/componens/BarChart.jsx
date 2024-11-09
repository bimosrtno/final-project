import React, { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

let myChartSukses, myChartBatal;

const BarChart = () => {
    const [data, setData] = useState({ labels: [], totalTransaksi: [], totalTransaksiBatal: [] });
    const [days, setDays] = useState(30); // Default to 30 days

    const fetchSalesData = async (days) => {
        try {
            const today = new Date();
            const startDate = new Date();
            startDate.setDate(today.getDate() - days);

            const responseSuccess = await fetch(`http://localhost:5000/api/chart/success?start_date=${startDate.toISOString().split('T')[0]}&end_date=${today.toISOString().split('T')[0]}`);
            const resultSuccess = await responseSuccess.json();

            const responseFailed = await fetch(`http://localhost:5000/api/chart/failed?start_date=${startDate.toISOString().split('T')[0]}&end_date=${today.toISOString().split('T')[0]}`);
            const resultFailed = await responseFailed.json();

            if (resultSuccess && resultSuccess.rows && resultFailed && resultFailed.rows) {
                const aggregatedDataSuccess = resultSuccess.rows.reduce((acc, item) => {
                    const date = new Date(item.date);
                    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
                    if (!acc[formattedDate]) {
                        acc[formattedDate] = 0;
                    }
                    acc[formattedDate] += item.total_transaksi;
                    return acc;
                }, {});

                const aggregatedDataFailed = resultFailed.rows.reduce((acc, item) => {
                    const date = new Date(item.date);
                    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
                    if (!acc[formattedDate]) {
                        acc[formattedDate] = 0;
                    }
                    acc[formattedDate] += item.total_transaksi_batal;
                    return acc;
                }, {});

                const labels = Object.keys(aggregatedDataSuccess);
                const totalTransaksi = labels.map(label => aggregatedDataSuccess[label]);
                const totalTransaksiBatal = labels.map(label => aggregatedDataFailed[label] || 0);

                setData({ labels, totalTransaksi, totalTransaksiBatal });
            } else {
                console.error('Unexpected format', resultSuccess, resultFailed);
            }
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
    };

    useEffect(() => {
        fetchSalesData(days);
    }, [days]);

    useEffect(() => {
        const canvasSukses = document.getElementById('myLineChartSukses');
        const ctxSukses = canvasSukses.getContext('2d');

        if (myChartSukses) {
            myChartSukses.destroy();
        }

        myChartSukses = new Chart(ctxSukses, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Total Transaksi Sukses',
                        data: data.totalTransaksi,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        fill: false,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: false,
                            text: 'Tanggal'
                        }
                    },
                    y: {
                        beginAtZero: true,
                    }
                },
                plugins: {
                    legend: { display: true, position: 'top' }
                }
            }
        });

        const canvasBatal = document.getElementById('myLineChartBatal');
        const ctxBatal = canvasBatal.getContext('2d');

        if (myChartBatal) {
            myChartBatal.destroy();
        }

        myChartBatal = new Chart(ctxBatal, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Total Transaksi Batal',
                        data: data.totalTransaksiBatal,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                        fill: false,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: false,
                            text: 'Tanggal'
                        }
                    },
                    y: {
                        beginAtZero: true,
                    }
                },
                plugins: {
                    legend: { display: true, position: 'top' }
                }
            }
        });

        return () => {
            if (myChartSukses) {
                myChartSukses.destroy();
            }
            if (myChartBatal) {
                myChartBatal.destroy();
            }
        };
    }, [data]);

    return (
        <div>
            <div className="mb-4 flex space-x-2">
                <button 
                    type="button" 
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                    onClick={() => setDays(30)}
                >
                    30 Hari Terakhir
                </button>
                <button 
                    type="button" 
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                    onClick={() => setDays(7)}
                >
                    7 Hari Terakhir
                </button>
            </div>
            {/* Flex container for cards */}
            <div className="flex space-x-4">
                {/* Card for Total Transaksi Sukses */}
                <a href="#" className="block max-w-xl w-full p-6 bg-white border border-gray-200 rounded-lg shadow mb-6 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Total Transaksi Sukses</h5>
                    <div style={{ width: '100%', height: '300px' }}>
                        <canvas id="myLineChartSukses" style={{ height: '100%', width: '100%' }}></canvas>
                    </div>
                </a>
                {/* Card for Total Transaksi Batal */}
                <a href="#" className="block max-w-xl w-full p-6 bg-white border border-gray-200 rounded-lg shadow mb-6 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Total Transaksi Batal</h5>
                    <div style={{ width: '100%', height: '300px' }}>
                        <canvas id="myLineChartBatal" style={{ height: '100%', width: '100%' }}></canvas>
                    </div>
                </a>
            </div>
        </div>
    );
};

export default BarChart;