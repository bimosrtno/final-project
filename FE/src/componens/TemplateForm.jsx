import React, { useState, useEffect } from 'react';

const TemplateForm = ({ onSubmit, editingId, existingTemplate, message }) => {
    const [template, setTemplate] = useState('');
    const [type, setType] = useState('sls');
    const [isOpen, setIsOpen] = useState(false); // State untuk mengontrol modal

    useEffect(() => {
        if (existingTemplate) {
            setTemplate(existingTemplate.template);
            setType(existingTemplate.type);
        } else {
            setTemplate('');
            setType('sls');
        }
    }, [existingTemplate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        onSubmit({ template, type });
        setIsOpen(false); // Tutup modal setelah submit
    };

    return (
        <>
            {/* Tombol untuk membuka modal */}
            <button 
                onClick={() => setIsOpen(true)} 
                className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-4" 
                type="button"
            >
                {editingId ? 'Edit Template' : 'Tambah Template'}
            </button>

            {/* Modal */}
            {isOpen && (
                <div id="crud-modal" className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
                    <div className="relative p-6 w-full max-w-md bg-white rounded-lg shadow">
                        {/* Modal header */}
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="text-lg font-semibold text-gray-900">Template Form</h3>
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-2"
                            >
                                <svg className="w-3 h-3" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10.586L17.414 5.172 19 6.586 13.586 12 19 17.414l-1.586 1.414L12 13.414l-5.414 5.414L5.172 17 10.586 12 5.172 6.586 6.586 5.172 12 10.586z" /></svg>
                            </button>
                        </div>

                        {/* Modal body */}
                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="mb-4">
                                <label htmlFor="template" className="block text-sm font-medium text-gray-700">Template:</label>
                                <textarea
                                    id="template"
                                    value={template}
                                    onChange={(e) => setTemplate(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm h-24"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipe:</label>
                                <select
                                    id="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="sls">Sales</option>
                                    <option value="cust">Marketing</option>
                                </select>
                            </div>
                            <button type="submit" className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                {editingId ? 'Simpan Template' : 'Tambah Template'}
                            </button>
                            {message && <p className="text-green-600 mb-4">{message}</p>}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default TemplateForm;