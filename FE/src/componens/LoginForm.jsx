import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Menggunakan useNavigate
import { Helmet } from 'react-helmet';
import axios from 'axios';


const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate(); // Menggunakan useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            const { token, role } = response.data;

            // Simpan token di local storage
            localStorage.setItem('token', token); 

            // Arahkan pengguna berdasarkan role
            switch (role) {
                case 'sales':
                    navigate('/admin-sales/customerlist'); // Arahkan ke dashboard sales
                    break;
                case 'gudang':
                    navigate('/admin-gudang'); // Arahkan ke dashboard gudang
                    break;
                case 'superadmin':
                    navigate('/super-admin'); // Arahkan ke dashboard superadmin
                    break;
                default:
                    navigate('/'); // Jika role tidak dikenali
                    break;
            }

            setResponseMessage('Berhasil login!'); // Pesan sukses
        } catch (error) {
            console.error('Error logging in:', error);
            setResponseMessage('Login gagal. Silakan coba lagi.'); // Pesan error
        }
    };

    return (
        <div>   
       <Helmet><title>Login </title></Helmet>
        <form 
            className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md border" 
            onSubmit={handleSubmit}
        >
            <h2 className="text-center text-2xl font-bold mb-4">TemanTani</h2>
            <div className="mb-5">
                <label 
                    htmlFor="username" 
                    className="block mb-2 text-sm font-medium text-gray-900"
                >
                    Username
                </label>
                <input 
                    type="text" // Menggunakan tipe text untuk username
                    id="username" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                />
            </div>
            <div className="mb-5">
                <label 
                    htmlFor="password" 
                    className="block mb-2 text-sm font-medium text-gray-900"
                >
                    Password
                </label>
                <input 
                    type="password" 
                    id="password" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
            </div>
            <div className="flex items-start mb-5">
                <div className="flex items-center h-5">
                    <input 
                        id="remember" 
                        type="checkbox" 
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" 
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                    />
                </div>
                <label 
                    htmlFor="remember" 
                    className="ml-2 text-sm font-medium text-gray-900"
                >
                    Remember me
                </label>
            </div>
            <button 
                type="submit" 
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
            >
                Login
            </button>
            {responseMessage && <p className="mt-2 text-center text-red-600">{responseMessage}</p>}
        </form>
        </div>
    );
};

export default LoginForm;