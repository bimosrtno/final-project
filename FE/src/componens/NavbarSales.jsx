import React from 'react';
import { Link } from 'react-router-dom';

function NavbarSales() {
    return (
        <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 fixed top-0 left-0 w-full z-100">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center p-4">
                <span className="logo text-4xl text-blue-500 text-2xl font-bold">TemanTani</span> {/* Logo */}

                <ul className="flex space-x-4"> {/* Gunakan flex untuk menampilkan tombol secara horizontal */}
                    <li>
                        <Link to="/admin-sales/customerlist" className="block py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Customer List
                        </Link>
                    </li>
                    <li>
                        <Link to="/salestable" className="block py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Sales Table
                        </Link>
                    </li>
                    <li>
                        <Link to="/login" className="block py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Log Out
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavbarSales;