import React from 'react';
import { Link } from 'react-router-dom'; 
import LoginForm from '../../componens/LoginForm';

function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <LoginForm />
    </div>
  );
}

export default Login;