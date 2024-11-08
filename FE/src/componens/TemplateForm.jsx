import React, { useState, useEffect } from 'react';

const TemplateForm = ({ onSubmit, editingId, existingTemplate, message }) => {
    const [template, setTemplate] = useState('');
    const [type, setType] = useState('sls');

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
        onSubmit({ template, type }); // Hapus id jika tidak diperlukan
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="mt-4">
                <label htmlFor="template" className="block text-sm font-medium text-gray-700">
                    Template:
                </label>
                <textarea
                    id="template"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm h-24"
                />
            </div>
            <div className="mt-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Tipe:
                </label>
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
    );
};

export default TemplateForm;