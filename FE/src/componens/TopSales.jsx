import React, { useEffect, useState } from "react";

const TopSale = () => {
    const [topSale, setTopSale] = useState(null);
    const [topCustomer, setTopCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopSale = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/sales/top-sale'); // Sesuaikan URL
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched Top Sale data:", data);
                setTopSale(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchTopCustomer = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/sales/top-customer'); // Ini sudah benar
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched Top Customer data:", data);
                setTopCustomer(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchTopSale();
        fetchTopCustomer();
    }, []);

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(amount);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="flex space-x-4">
            {/* Top Sale Section */}
            <div className="top-sale border p-4 rounded-lg bg-gray-100 w-1/2">
                {topSale ? (
                    <>
                        <p><strong>TOP SALES</strong></p>
                        <p><strong>ID Transaksi:</strong> {topSale.id_transaksi}</p>
                        <p><strong>ID Customer:</strong> {topSale.id_customer}</p>
                        <p><strong>Nama Customer:</strong> {topSale.customer_name}</p>
                        <p><strong>Total Transaksi:</strong> {formatRupiah(topSale.total_transaksi)}</p>
                    </>
                ) : (
                    <p>Tidak ada data penjualan.</p>
                )}
            </div>

            {/* Top Customer Section */}
            <div className="top-customer border p-4 rounded-lg bg-gray-100 w-1/2">
                {topCustomer ? (
                    <>
                        <p><strong>TOP CUSTOMER</strong></p>
                        <p><strong>ID Customer:</strong> {topCustomer.id_customer}</p>
                        <p><strong>Nama Customer:</strong> {topCustomer.customer_name}</p>
                        <p><strong>Jumlah Transaksi:</strong> {topCustomer.transaction_count}</p>
                        <p><strong>Total Transaksi:</strong> {formatRupiah(topCustomer.total_transaksi)}</p>
                    </>
                ) : (
                    <p>Tidak ada data customer.</p>
                )}
            </div>
        </div>
    );
};

export default TopSale;