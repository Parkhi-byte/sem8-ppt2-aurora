import React from 'react';
import { useDocumentShare } from '../hooks/useDocumentShare/useDocumentShare';
import DocumentTable from '../components/DocumentShare/DocumentTable';
import { Upload, Search, Folder, Clock } from 'lucide-react';

const DocumentShare = () => {
  const fileInputRef = React.useRef(null);
  const {
    documents,
    loading,
    searchTerm,
    setSearchTerm,
    uploadFile,
    handleDelete,
    handleShare,
    getFileIcon,
    filteredDocs
  } = useDocumentShare();

  const onFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 lg:p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Documents</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and share files with your team securely.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-aurora-500/20 focus:border-aurora-500 w-64 transition-all"
              />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileSelect}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-5 py-2.5 bg-aurora-600 text-white rounded-xl font-medium hover:bg-aurora-700 transition-colors shadow-lg shadow-aurora-500/20"
            >
              <Upload size={18} />
              <span>Upload</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Access Folders */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Projects', 'Design', 'Finance', 'Marketing'].map((folder, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-aurora-500 dark:hover:border-aurora-500 transition-colors cursor-pointer group">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${['bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600', 'bg-green-100 text-green-600', 'bg-pink-100 text-pink-600'][i]
                    }`}>
                    <Folder size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-aurora-600 dark:group-hover:text-aurora-400 transition-colors">{folder}</h3>
                  <p className="text-xs text-gray-500 mt-1">0 files</p>
                </div>
              ))}
            </div>

            {/* Recent Files Table */}
            <DocumentTable
              loading={loading}
              filteredDocs={filteredDocs}
              handleDelete={handleDelete}
              handleShare={handleShare}
              getFileIcon={getFileIcon}
            />

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Storage Usage */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Storage</h3>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">2.4 GB used</span>
                <span className="text-gray-900 dark:text-white font-medium">10 GB total</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden mb-4">
                <div className="bg-gradient-to-r from-aurora-500 to-purple-500 h-full rounded-full" style={{ width: '24%' }}></div>
              </div>
              <button className="w-full py-2 text-sm font-medium text-aurora-600 dark:text-aurora-400 border border-aurora-200 dark:border-aurora-800 rounded-xl hover:bg-aurora-50 dark:hover:bg-aurora-900/20 transition-colors">
                Upgrade Storage
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {documents.slice(0, 3).map((doc, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="mt-0.5 p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                      <Clock size={14} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">You</span> uploaded {doc.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Just now</p>
                    </div>
                  </div>
                ))}
                {documents.length === 0 && <p className="text-sm text-gray-500">No recent activity.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentShare;
