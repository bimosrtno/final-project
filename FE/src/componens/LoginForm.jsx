import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            const { token, role } = response.data;
    
            // Hapus token lama dan simpan token baru
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            console.log("Token received:", token);
    
            if (rememberMe) localStorage.setItem('token', token);
            else sessionStorage.setItem('token', token);
    
            console.log("Role received:", role);
            if (role === 'superadmin') navigate('/super-admin');
            else if (role === 'gudang') navigate('/admin-gudang');
            else if (role === 'sales') navigate('/admin-sales');
            else throw new Error('Invalid role');
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage(error.response?.data?.message || 'An error occurred');
        }
    };
    
    

    return (
        <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <label>
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                />
                Remember Me
            </label>
            <button type="submit">Login</button>
            {errorMessage && <p>{errorMessage}</p>}
        </form>
    );
};

export default LoginForm;
