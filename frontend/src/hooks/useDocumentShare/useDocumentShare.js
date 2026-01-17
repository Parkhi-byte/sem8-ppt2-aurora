
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FileText, PenTool, FileSpreadsheet, FileImage } from 'lucide-react';

export const useDocumentShare = () => {
    const { user } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchDocuments = async () => {
        try {
            const response = await fetch('/api/documents', {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setDocuments(data);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.token) {
            fetchDocuments();
        }
    }, [user]);

    const uploadFile = async (file) => {
        if (!file) return;

        const name = file.name;
        const type = name.split('.').pop();
        const size = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

        try {
            const response = await fetch('/api/documents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({ name, type, size, folder: 'General' }),
            });

            if (response.ok) {
                fetchDocuments();
            } else {
                alert('Failed to upload');
            }
        } catch (error) {
            console.error('Error uploading:', error);
        }
    };

    const handleShare = (doc) => {
        const link = `${window.location.origin}/share/${doc._id}`;
        navigator.clipboard.writeText(link);
        alert(`Link copied to clipboard: ${link}`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this file?")) return;

        try {
            const response = await fetch(`/api/documents/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });
            if (response.ok) {
                setDocuments(documents.filter(d => d._id !== id));
            }
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const getFileIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'pdf': return { icon: FileText, color: 'text-red-500 bg-red-100 dark:bg-red-900/20' };
            case 'figma': case 'fig': return { icon: PenTool, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/20' };
            case 'xls': case 'xlsx': return { icon: FileSpreadsheet, color: 'text-green-500 bg-green-100 dark:bg-green-900/20' };
            case 'doc': case 'docx': return { icon: FileText, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/20' };
            case 'png': case 'jpg': case 'jpeg': return { icon: FileImage, color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20' };
            default: return { icon: FileText, color: 'text-gray-500 bg-gray-100 dark:bg-gray-700/50' };
        }
    };

    const filteredDocs = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
        documents,
        setDocuments, // Exported in case manual update needed
        loading,
        searchTerm,
        setSearchTerm,
        fetchDocuments, // Exported for manual refresh
        uploadFile,
        handleDelete,
        handleShare,
        getFileIcon,
        filteredDocs
    };
};
