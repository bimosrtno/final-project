import React, { useEffect, useState } from "react";

const TopSale = () => {
    const [topSale, setTopSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopSale = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/sales/top-sale');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched data:", data);
                setTopSale(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTopSale();
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
        <div className="top-sale">
            {topSale ? (
                <div className="border p-4 rounded-lg bg-gray-100">
                    <p><strong>TOP SALES</strong> </p>
                    <p><strong>ID Transaksi:</strong> {topSale.id_transaksi}</p>
                    <p><strong>ID Customer:</strong> {topSale.id_customer}</p>
                    <p><strong>Nama Customer:</strong> {topSale.customer_name}</p>
                    <p><strong>Total Transaksi:</strong> {formatRupiah(topSale.total_transaksi)}</p>
                </div>
            ) : (
                <p>Tidak ada data penjualan.</p>
            )}
        </div>
    );
};

export default TopSale;