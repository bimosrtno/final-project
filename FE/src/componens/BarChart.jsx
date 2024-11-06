import React, { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

let myChartSukses, myChartBatal;

const BarChart = () => {
    const [data, setData] = useState({ labels: [], totalTransaksi: [], totalTransaksiBatal: [] });

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                // Menghitung tanggal 30 hari yang lalu
                const today = new Date();
                const last30Days = new Date();
                last30Days.setDate(today.getDate() - 30);

                // Mengambil data transaksi sukses
                const responseSuccess = await fetch(`http://localhost:5000/api/chart/success?start_date=${last30Days.toISOString().split('T')[0]}&end_date=${today.toISOString().split('T')[0]}`);
                const resultSuccess = await responseSuccess.json();

                // Mengambil data transaksi batal
                const responseFailed = await fetch(`http://localhost:5000/api/chart/failed?start_date=${last30Days.toISOString().split('T')[0]}&end_date=${today.toISOString().split('T')[0]}`);
                const resultFailed = await responseFailed.json();

                // Memastikan format data yang dikembalikan
                if (resultSuccess && resultSuccess.rows && resultFailed && resultFailed.rows) {
                    const labels = resultSuccess.rows.map(item => {
                        const date = new Date(item.date);
                        return date.toLocaleDateString('id-ID'); // Format tanggal
                    });

                    const totalTransaksi = resultSuccess.rows.map(item => item.total_transaksi);
                    const totalTransaksiBatal = resultFailed.rows.map(item => item.total_transaksi_batal);

                    setData({ labels, totalTransaksi, totalTransaksiBatal });
                } else {
                    console.error('Unexpected format', resultSuccess, resultFailed);
                }
            } catch (error) {
                console.error('Error fetching sales data:', error);
            }
        };

        fetchSalesData();
    }, []);

    useEffect(() => {
        const canvasSukses = document.getElementById('myLineChartSukses');
        const ctxSukses = canvasSukses.getContext('2d');

        if (myChartSukses) {
            myChartSukses.destroy();
        }

        myChartSukses = new Chart(ctxSukses, {
            type: 'line', // Mengubah tipe chart menjadi line
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Total Transaksi Sukses',
                        data: data.totalTransaksi,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        fill: false, // Mengisi area di bawah garis
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
                    legend: {
                        display: true,
                        position: 'top',
                    }
                }
            }
        });

        const canvasBatal = document.getElementById('myLineChartBatal');
        const ctxBatal = canvasBatal.getContext('2d');

        if (myChartBatal) {
            myChartBatal.destroy();
        }

        myChartBatal = new Chart(ctxBatal, {
            type: 'line', // Tipe chart kedua juga line
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
                    legend: {
                        display: true,
                        position: 'top',
                    }
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
            <canvas id="myLineChartSukses" width="900" height="300"></canvas>
            <canvas id="myLineChartBatal" width="900" height="300"></canvas>
        </div>
    );
};

export default BarChart;