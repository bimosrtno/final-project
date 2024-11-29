import React, { useState, useEffect } from 'react';
import TemplateForm from './TemplateForm';
import TemplateEdit from './TemplateEdit';

const TemplateManager = () => {
    const [templatesSls, setTemplatesSls] = useState([]);
    const [templatesCust, setTemplatesCust] = useState([]);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [message, setMessage] = useState('');

    const itemsPerPage = 5;
    const [currentPageSls, setCurrentPageSls] = useState(1);
    const [currentPageCust, setCurrentPageCust] = useState(1);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const responseSls = await fetch('http://localhost:5000/api/templates/sls');
            const responseCust = await fetch('http://localhost:5000/api/templates/cust');

            const dataSls = await responseSls.json();
            const dataCust = await responseCust.json();

            // Mengurutkan data berdasarkan waktu pembuatan (misalnya, dari yang terbaru)
            const sortedSls = dataSls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const sortedCust = dataCust.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setTemplatesSls(sortedSls);
            setTemplatesCust(sortedCust);
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

            // Update status di dalam state tanpa memanggil fetchTemplates lagi
            setTemplatesSls((prev) =>
                prev.map((template) => 
                    template.id === id ? { ...template, is_active: isActive } : template
                )
            );

            setTemplatesCust((prev) =>
                prev.map((template) => 
                    template.id === id ? { ...template, is_active: isActive } : template
                )
            );

            setMessage('Status template berhasil diubah');
        } catch (error) {
            setMessage(error.message);
        }
    };

    const getTypeLabel = (type) => {
        return type === 'sls' ? 'Sales' : 'Customer';
    };

    // Pagination 
    const totalPagesSls = Math.ceil(templatesSls.length / itemsPerPage);
    const indexOfLastItemSls = currentPageSls * itemsPerPage;
    const indexOfFirstItemSls = indexOfLastItemSls - itemsPerPage;
    const currentSlsTemplates = templatesSls.slice(indexOfFirstItemSls, indexOfLastItemSls);

    const totalPagesCust = Math.ceil(templatesCust.length / itemsPerPage);
    const indexOfLastItemCust = currentPageCust * itemsPerPage;
    const indexOfFirstItemCust = indexOfLastItemCust - itemsPerPage;
    const currentCustTemplates = templatesCust.slice(indexOfFirstItemCust, indexOfLastItemCust);

    return (
        <div className="p-4">
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
            
            {/* Tabel untuk Sales Templates */}
            <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"> {/* Latar belakang tabel */}
            <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-300 dark:text-gray-400"> {/* Warna latar belakang header dan teks */}
                        <tr>
                            <th className="py-2 border-b">Template</th>
                            <th className="py-2 border-b">Tipe</th>
                            <th className="py-2 border-b">Status</th>
                            <th className="py-2 border-b">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSlsTemplates.map((template) => (
                            <tr key={template.id} className="bg-gray-200 border-b text-gray-800 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
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
                {/* Pagination for Sales Templates */}
                <div className="flex justify-between mt-4">
                    <a 
                      href="#" 
                      onClick={() => currentPageSls > 1 && setCurrentPageSls(currentPageSls - 1)} 
                      className={`flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 border border-gray-300 rounded-lg ${currentPageSls === 1 ? 'pointer-events-none text-gray-300' : ''}`}
                    >
                      Previous
                    </a>

                    <a 
                      href="#" 
                      onClick={() => currentPageSls < totalPagesSls && setCurrentPageSls(currentPageSls + 1)} 
                      className={`flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 border border-gray-300 rounded-lg ${currentPageSls === totalPagesSls ? 'pointer-events-none text-gray-300' : ''}`}
                    >
                      Next
                    </a>
                </div>
            </div>

            {/* Tabel untuk Customer Templates */}
            <div className="overflow-x-auto mt-4">
                <h3 className="text-lg font-bold mb-2 bg-white">Customer Templates</h3>
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
                        {currentCustTemplates.map((template) => (
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
                {/* Pagination for Customer Templates */}
                <div className="flex justify-between mt-4">
                    <a 
                      href="#" 
                      onClick={() => currentPageCust > 1 && setCurrentPageCust(currentPageCust - 1)} 
                      className={`flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 border border-gray-300 rounded-lg ${currentPageCust === 1 ? 'pointer-events-none text-gray-300' : ''}`}
                    >
                      Previous
                    </a>

                    <a 
                      href="#" 
                      onClick={() => currentPageCust < totalPagesCust && setCurrentPageCust(currentPageCust + 1)} 
                      className={`flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 border border-gray-300 rounded-lg ${currentPageCust === totalPagesCust ? 'pointer-events-none text-gray-300' : ''}`}
                    >
                      Next
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TemplateManager;