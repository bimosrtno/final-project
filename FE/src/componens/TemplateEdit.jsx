// TemplateEdit.js
import React, { useState, useEffect } from 'react';

const TemplateEdit = ({ onSubmit, templateToEdit, onCancel }) => {
    const [template, setTemplate] = useState('');
    const [type, setType] = useState('sls'); // Default type

    useEffect(() => {
        if (templateToEdit) {
            setTemplate(templateToEdit.template);
            setType(templateToEdit.type);
        }
    }, [templateToEdit]);

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({ template, type, id: templateToEdit.id });
    };

    if (!templateToEdit) {
        return null; // Tidak menampilkan form jika tidak ada template yang dieksekusi
    }

    return (
        // Main modal
        <div id="crud-modal" className="fixed top-0 right-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative p-4 w-full max-w-md">
                {/* Modal content */}
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    {/* Modal header */}
                    <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Edit Template
                        </h3>
                        <button 
                            type="button" 
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={onCancel} // Menutup modal
                        >
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    {/* Modal body */}
                    <form onSubmit={handleSubmit} className="p-4 md:p-5">
                        <div className="grid gap-4 mb-4">
                            <div className="col-span-2">
                                <label htmlFor="template" className="block text-sm font-medium text-gray-900 dark:text-white">
                                    Template:
                                </label>
                                <textarea
                                    id="template"
                                    value={template}
                                    onChange={(e) => setTemplate(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm h-24"
                                />
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="type" className="block text-sm font-medium text-gray-900 dark:text-white">
                                    Tipe:
                                </label>
                                <select
                                    id="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm"
                                >
                                    <option value="sls">Sales</option>
                                    <option value="cust">Marketing</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Simpan Template
                        </button>
                        {/* Tombol Batal */}
                        <button 
                            type="button" 
                            onClick={onCancel} 
                            className="mt-4 inline-flex items-center px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 ml-2"
                        >
                            Batal
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TemplateEdit;