import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddAdminForm from './AddAdminForm';

const AdminTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // Misalnya 10 item per halaman

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/users');
            setUsers(response.data); // Simpan urutan yang sama dari server
            setLoading(false);
        } catch (error) {
            setError('Error fetching users');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleResetPassword = async (userId) => {
        const newPassword = prompt('Masukkan Password Baru:');
        
        if (newPassword) {
            try {
                await axios.put(`http://localhost:5000/api/auth/reset-password`, {
                    id: userId,
                    newPassword: newPassword,
                });
                alert('Password berhasil di-reset!');
                await fetchUsers(); // Memanggil ulang untuk mendapatkan data terbaru
            } catch (error) {
                alert('Error resetting password: ' + error.message);
            }
        }
    };

    const handleChangeStatus = async (userId, isActive) => {
        try {
            const newStatus = !isActive; // Toggle status
            await axios.put(`http://localhost:5000/api/auth/toggle-active`, {
                id: userId,
                isActive: newStatus,
            });
            alert('Status pengguna berhasil diubah!');

            // Update daftar pengguna tanpa mengubah urutannya
            setUsers(prevUsers => {
                const updatedUsers = prevUsers.map(user => 
                    user.id === userId ? { ...user, is_active: newStatus } : user
                );
                return updatedUsers; // Tidak dirubah urutannya
            });
        } catch (error) {
            alert('Error changing status: ' + error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Urutkan data, dengan pengguna terbaru di atas dan tanpa mengubah urutan ketika ada update
    const sortedUsers = [...users].reverse(); // Balik untuk menampilkan data terbaru di atas

    // Pagination Logic
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

    return (
        <div>
            <p className="text-4xl font-semibold text-white  mt-2 mb-6">Daftar Admin</p>
            
            <div className="mb-3">
                <AddAdminForm />
            </div>
            
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-300 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nama</th>
                            <th scope="col" className="px-6 py-3">Nomor</th>
                            <th scope="col" className="px-6 py-3">Username</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user.id} className={`bg-gray-200 border-b text-gray-800 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600`}>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.nama}</td>
                                <td className="px-6 py-4">{user.nomor}</td>
                                <td className="px-6 py-4">{user.username}</td>
                                <td className="px-6 py-4">{user.role}</td>
                                <td className="px-6 py-4">
                                    {user.role === 'superadmin' ? (
                                        <span className="text-gray-500">Aktif</span>
                                    ) : (
                                        <select 
                                            value={user.is_active ? 'Aktif' : 'Non Aktif'}
                                            onChange={(e) => handleChangeStatus(user.id, user.is_active)}
                                        >
                                            <option value='Aktif'>Aktif</option>
                                            <option value='Non Aktif'>Non Aktif</option>
                                        </select>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <button 
                                        type="button" 
                                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                        onClick={() => handleResetPassword(user.id)}
                                    >
                                        Reset Password
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between mt-4">
                <a 
                    href="#" 
                    className="flex items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                    <svg className="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
                    </svg>
                    Previous
                </a>
                <a 
                    href="#" 
                    className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                    Next
                    <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </a>
            </div>
        </div>
    );
};

export default AdminTable;