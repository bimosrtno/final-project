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

            // Memastikan format data yang dikembalikan
            if (resultSuccess && resultSuccess.rows && resultFailed && resultFailed.rows) {
                const aggregatedDataSuccess = resultSuccess.rows.reduce((acc, item) => {
                    const date = new Date(item.date).toLocaleDateString('id-ID');
                    if (!acc[date]) {
                        acc[date] = 0;
                    }
                    acc[date] += item.total_transaksi;
                    return acc;
                }, {});

                const aggregatedDataFailed = resultFailed.rows.reduce((acc, item) => {
                    const date = new Date(item.date).toLocaleDateString('id-ID');
                    if (!acc[date]) {
                        acc[date] = 0;
                    }
                    acc[date] += item.total_transaksi_batal;
                    return acc;
                }, {});

                const labels = Object.keys(aggregatedDataSuccess);
                const totalTransaksi = labels.map(label => aggregatedDataSuccess[label]);
                const totalTransaksiBatal = labels.map(label => aggregatedDataFailed[label] || 0); // Default 0 jika tidak ada data

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
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tanggal'
                        }
                    },
                    y: {
                        beginAtZero: true,
                    }
                },
                plugins: {
                    legend: { display: true, position: 'top', }
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
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tanggal'
                        }
                    },
                    y: {
                        beginAtZero: true,
                    }
                },
                plugins: {
                    legend: { display: true, position: 'top', }
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
            <button onClick={() => setDays(30)}>30 Hari Terakhir</button>
            <button onClick={() => setDays(7)}>7 Hari Terakhir</button>
            <div style={{ width: '110%', height: '300px' }}>
                <canvas id="myLineChartSukses"></canvas>
            </div>
            <div style={{ width: '110%', height: '300px' }}>
                <canvas id="myLineChartBatal"></canvas>
            </div>
        </div>
    );
};

export default BarChart;