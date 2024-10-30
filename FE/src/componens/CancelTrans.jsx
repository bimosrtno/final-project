// CancelTransaction.jsx
import React, { useState } from 'react';

const CancelTransaction = () => {
  const [transactionId, setTransactionId] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');

  const handleCancel = async () => {
    try {
        const response = await fetch(`http://localhost:5000/api/sales/cancel/${transactionId}`, { // Ganti dengan port yang sesuai
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ note }),
        });

        if (response.ok) {
            setMessage('Transaksi berhasil dibatalkan');
            // Reset form
            setTransactionId('');
            setNote('');
        } else {
            const errorData = await response.json();
            setMessage('Gagal membatalkan transaksi: ' + errorData.error);
        }
    } catch (error) {
        setMessage('Terjadi kesalahan: ' + error.message);
    }
};
  return (
    <div>
      <h2>Batal Transaksi</h2>
      <input
        type="text"
        placeholder="ID Transaksi"
        value={transactionId}
        onChange={(e) => setTransactionId(e.target.value)}
        required
      />
      <textarea
        placeholder="Catatan"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        required
      />
      <button onClick={handleCancel}>Submit</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CancelTransaction;