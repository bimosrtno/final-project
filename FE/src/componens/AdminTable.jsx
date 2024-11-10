import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddAdminForm from './AddAdminForm';

const AdminTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user.id === userId ? { ...user, is_active: newStatus } : user
                )
            );
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

    return (
        <div>
            <p className="text-4xl font-semibold text-gray-900 dark:text-white mb-6">Daftar Admin</p>
            
            <div className="mb-3">
                <AddAdminForm />
            </div>
            
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                        {users.map((user, index) => (
                            <tr key={user.id} className={`odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 border-b dark:border-gray-700`}>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.nama}</td>
                                <td className="px-6 py-4">{user.nomor}</td>
                                <td className="px-6 py-4">{user.username}</td>
                                <td className="px-6 py-4">{user.role}</td>
                                <td className="px-6 py-4">
                                    <select 
                                        value={user.is_active ? 'Aktif' : 'Non Aktif'}
                                        onChange={(e) => handleChangeStatus(user.id, user.is_active)}
                                    >
                                        <option value='Aktif'>Aktif</option>
                                        <option value='Non Aktif'>Non Aktif</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <button 
                                        type="button" 
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
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
        </div>
    );
};

export default AdminTable;