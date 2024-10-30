import React, { useState } from 'react';

const CancelTransaction = () => {
  const [transactionId, setTransactionId] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false); // state untuk mengontrol modal

  const handleCancel = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/sales/cancel/${transactionId}`, {
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
        setIsOpen(false); // tutup modal setelah berhasil
      } else {
        const errorData = await response.json();
        setMessage('Gagal membatalkan transaksi: ' + errorData.error);
      }
    } catch (error) {
      setMessage('Terjadi kesalahan: ' + error.message);
    }
  };

  return (
    <>
      {/* Modal toggle */}
      <button 
        onClick={() => setIsOpen(true)} 
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
        type="button"
      >
        Cancel Transaktion
      </button>

      {/* Main modal */}
      {isOpen && (
        <div id="crud-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Batal Transaksi
                </h3>
                <button 
                  type="button" 
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" 
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal body */}
              <div className="p-4 md:p-5">
                <input
                  type="text"
                  placeholder="ID Transaksi"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 mb-4"
                />
                <textarea
                  placeholder="Catatan"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  required
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
                />
                <div className="flex justify-between">
                  <button 
                    onClick={handleCancel} 
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    type="button"
                  >
                    Submit
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="text-white inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
                {message && <p className="mt-4 text-red-500">{message}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CancelTransaction;