import React, { useState } from 'react';

function LoginForm() {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logika penanganan login bisa ditambahkan di sini
    setResponseMessage('Berhasil login!'); // Contoh respons
  };

  return (
    <form 
      className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md border"
      onSubmit={handleSubmit}
    >
      <div className="mb-5">
        <label 
          htmlFor="email" 
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Username
        </label>
        <input 
          type="email" 
          id="email" 
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
          placeholder="name@flowbite.com" 
          value={username}
          onChange={(e) => setEmail(e.target.value)}
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
        Submit
      </button>
      {responseMessage && <p className="mt-2 text-center text-green-600">{responseMessage}</p>}
    </form>
  );
}

export default LoginForm;