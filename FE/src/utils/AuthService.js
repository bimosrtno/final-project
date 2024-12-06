import jwtDecode from 'jwt-decode';

export const getRole = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) throw new Error('Token not found');

    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded); // Log isi token untuk debugging

    if (!decoded || !decoded.role) throw new Error('Role not found in token');
    return decoded.role;
};
