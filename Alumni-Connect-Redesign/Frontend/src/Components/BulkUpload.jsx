

import React, { useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import { getLoggedIn } from '../services/authService';
import NotLoggedIn from './helper/NotLoggedIn';
import { bulkImport } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import { DocumentArrowUpIcon } from '@heroicons/react/24/solid';

const BulkUpload = () => {
  const loggedIn = getLoggedIn();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('No file selected');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      await bulkImport(formData);
      toast.success('File uploaded and data imported!');
      setSelectedFile(null);
    } catch (err) {
      toast.error('Failed to import data');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center p-4">
      <ToastContainer />
      {loggedIn ? (
        <form onSubmit={handleUpload} encType='multipart/form-data' className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg animate-fade-in mt-12">
          <h2 className="text-2xl font-extrabold mb-6 text-center text-indigo-700 flex items-center justify-center"><DocumentArrowUpIcon className="h-7 w-7 text-indigo-400 mr-2" />Bulk Import Alumni/Professors/Students</h2>
          <div className="mb-6 ">
            <label htmlFor="fileInput" className="block text-sm font-medium text-gray-600 mb-2">
              Choose a file
            </label>
            <input
              id="fileInput"
              type="file"
              accept=".csv, .xlsx, .xls"
              className="mt-1 p-2 border w-full border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"
              onChange={handleFileChange}
            />
          </div>
          {selectedFile && (
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">Selected File:</h4>
              <p className="text-gray-600">{selectedFile.name}</p>
            </div>
          )}
          <button
            className="w-full flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            type='submit'
            disabled={loading}
          >
            <FaUpload className="inline-block mr-2 mt-1" />
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      ) : (
        <NotLoggedIn text="Bulk Import"/>
      )}
    </div>
  );
};

export default BulkUpload;
