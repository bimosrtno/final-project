import React, { useState, useEffect } from 'react';
import TemplateForm from './TemplateForm';
import TemplateEdit from './TemplateEdit';

const TemplateManager = () => {
    const [templatesSls, setTemplatesSls] = useState([]);
    const [templatesCust, setTemplatesCust] = useState([]);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const responseSls = await fetch('http://localhost:5000/api/templates/sls');
            const responseCust = await fetch('http://localhost:5000/api/templates/cust');
            const dataSls = await responseSls.json();
            const dataCust = await responseCust.json();
            setTemplatesSls(dataSls);
            setTemplatesCust(dataCust);
        } catch (error) {
            setMessage('Gagal memuat template');
        }
    };

    const handleTemplateSubmit = async ({ template, type }) => {
        try {
            const response = await fetch('http://localhost:5000/api/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ template, type }),
            });

            if (!response.ok) {
                throw new Error('Gagal menyimpan template');
            }

            setMessage('Template berhasil disimpan');
            fetchTemplates();
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleEdit = (template) => {
        setEditingTemplate(template);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/templates/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Gagal menghapus template');
            }

            setMessage('Template berhasil dihapus');
            fetchTemplates();
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleEditSubmit = async ({ template, type, id }) => {
        try {
            const response = await fetch(`http://localhost:5000/api/templates/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ template, type }),
            });

            if (!response.ok) {
                throw new Error('Gagal menyimpan template');
            }

            setMessage('Template berhasil diperbarui');
            setEditingTemplate(null);
            fetchTemplates();
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleStatusChange = async (id, isActive) => {
        try {
            const response = await fetch(`http://localhost:5000/api/templates/toggle/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: isActive }),
            });

            if (!response.ok) {
                throw new Error('Gagal mengubah status template');
            }

            setMessage('Status template berhasil diubah');
            fetchTemplates();
        } catch (error) {
            setMessage(error.message);
        }
    };

    const getTypeLabel = (type) => {
        return type === 'sls' ? 'Sales' : 'Customer';
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Kelola Template</h2>

            {!editingTemplate ? (
                <TemplateForm 
                    onSubmit={handleTemplateSubmit}
                    message={message}
                />
            ) : (
                <TemplateEdit 
                    onSubmit={handleEditSubmit}
                    templateToEdit={editingTemplate}
                    onCancel={() => setEditingTemplate(null)}
                />
            )}
            
            <div className="overflow-x-auto">
                <table className="min-w-full mx-auto bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead>
                        <tr>
                            <th className="py-2 border-b">Template</th>
                            <th className="py-2 border-b">Tipe</th>
                            <th className="py-2 border-b">Status</th>
                            <th className="py-2 border-b">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {templatesSls.map((template) => (
                            <tr key={template.id}>
                                <td className="border-b py-2 text-center max-w-xs overflow-x-auto whitespace-nowrap">{template.template}</td>
                                <td className="border-b py-2 text-center">{getTypeLabel(template.type)}</td>
                                <td className="border-b py-2 text-center">
                                    <select
                                        value={template.is_active ? 'Aktif' : 'Non Aktif'}
                                        onChange={(e) => handleStatusChange(template.id, e.target.value === 'Aktif')}
                                        className="border rounded-md"
                                    >
                                        <option value="Aktif">Aktif</option>
                                        <option value="Non Aktif">Non Aktif</option>
                                    </select>
                                </td>
                                <td className="border-b py-2 text-center">
                                    <button
                                        onClick={() => handleEdit(template)}
                                        className="mr-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(template.id)}
                                        className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Tabel untuk Customer Templates */}
            <div className="overflow-x-auto mt-4">
                <h3 className="text-lg font-bold mb-2">Customer Templates</h3>
                <table className="min-w-full mx-auto bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead>
                        <tr>
                            <th className="py-2 border-b">Template</th>
                            <th className="py-2 border-b">Tipe</th>
                            <th className="py-2 border-b">Status</th>
                            <th className="py-2 border-b">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {templatesCust.map((template) => (
                            <tr key={template.id}>
                                <td className="border-b py-2 text-center max-w-xs overflow-x-auto whitespace-nowrap">{template.template}</td>
                                <td className="border-b py-2 text-center">{getTypeLabel(template.type)}</td>
                                <td className="border-b py-2 text-center">
                                    <select
                                        value={template.is_active ? 'Aktif' : 'Non Aktif'}
                                        onChange={(e) => handleStatusChange(template.id, e.target.value === 'Aktif')}
                                        className="border rounded-md"
                                    >
                                        <option value="Aktif">Aktif</option>
                                        <option value="Non Aktif">Non Aktif</option>
                                    </select>
                                </td>
                                <td className="border-b py-2 text-center">
                                    <button
                                        onClick={() => handleEdit(template)}
                                        className="mr-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(template.id)}
                                        className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TemplateManager;