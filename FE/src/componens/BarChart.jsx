import React, { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

let myChartSukses, myChartBatal;

const BarChart = () => {
    const [data, setData] = useState({ labels: [], totalTransaksi: [], totalTransaksiBatal: [] });

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                // Mengambil data transaksi sukses
                const responseSuccess = await fetch('http://localhost:5000/api/chart/success');
                const resultSuccess = await responseSuccess.json();

                // Mengambil data transaksi batal
                const responseFailed = await fetch('http://localhost:5000/api/chart/failed');
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
        const canvasSukses = document.getElementById('myBarChartSukses');
        const ctxSukses = canvasSukses.getContext('2d');

        if (myChartSukses) {
            myChartSukses.destroy();
        }

        myChartSukses = new Chart(ctxSukses, {
            type: 'bar', // Mengubah tipe chart menjadi bar
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Total Transaksi Sukses',
                        data: data.totalTransaksi,
                        backgroundColor: 'rgba(75, 192, 192, 1)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tanggal' // Nama sumbu x
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Jumlah Transaksi' // Nama sumbu y
                        }
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

        const canvasBatal = document.getElementById('myBarChartBatal');
        const ctxBatal = canvasBatal.getContext('2d');

        if (myChartBatal) {
            myChartBatal.destroy();
        }

        myChartBatal = new Chart(ctxBatal, {
            type: 'bar', // Tipe chart kedua juga bar
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Total Transaksi Batal',
                        data: data.totalTransaksiBatal,
                        backgroundColor: 'rgba(255, 99, 132, 1)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tanggal' // Nama sumbu x
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Jumlah Transaksi' // Nama sumbu y
                        }
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
            <canvas id="myBarChartSukses" width="900" height="300"></canvas>
            <canvas id="myBarChartBatal" width="900" height="300"></canvas>
        </div>
    );
};

export default BarChart;