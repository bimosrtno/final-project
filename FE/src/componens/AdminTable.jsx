import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
            <h2>Daftar Pengguna</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Nomor</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Status</th> {/* Tambahkan header untuk kolom status */}
                        <th>Aksi</th> {/* Tambahkan header untuk kolom aksi */}
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.nama}</td>
                            <td>{user.nomor}</td>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>
                                {/* Menampilkan dropdown untuk mengubah status */}
                                <select 
                                    value={user.is_active ? 'Aktif' : 'Non Aktif'}
                                    onChange={(e) => handleChangeStatus(user.id, user.is_active)}
                                >
                                    <option value='Aktif'>Aktif</option>
                                    <option value='Non Aktif'>Non Aktif</option>
                                </select>
                            </td>
                            <td>
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
    );
};

export default AdminTable;