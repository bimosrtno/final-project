import React from 'react';
import { Link } from 'react-router-dom';

function NavbarInven() {
    return (
        <nav className="bg-gray-900 border-b border-gray-700">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2"> {/* Reduced padding */}
                    <span className="self-center text-xl font-semibold text-white whitespace-nowrap">TemanTani</span> {/* Reduced font size */}
                <button 
                    data-collapse-toggle="navbar-default" 
                    type="button" 
                    className="inline-flex items-center p-1 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none" 
                    aria-controls="navbar-default" 
                    aria-expanded="false"
                >
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="flex flex-col p-2 md:p-0 mt-2 space-y-2 md:flex-row md:space-x-4 md:space-y-0">
                        <li>
                            <Link 
                                to="/admin-sales/customerlist" 
                                className="block py-1 px-2 text-gray-300 rounded hover:bg-gray-700 hover:text-white dark:text-white md:hover:bg-transparent" 
                                aria-current="page"
                            >
                                List Customer
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin-sales" 
                                className="block py-1 px-2 text-gray-300 rounded hover:bg-gray-700 hover:text-white dark:text-white md:hover:bg-transparent"
                            >
                                Tabel Penjualan
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/login" 
                                className="block py-1 px-2 text-gray-300 rounded hover:bg-gray-700 hover:text-white dark:text-white md:hover:bg-transparent"
                            >
                                Log Out
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavbarInven;