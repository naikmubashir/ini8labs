import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import Notification from './components/Notification';

// API base URL
const API_URL = 'http://localhost:5001/api';

function App() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch all documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Fetch documents from API
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/documents`);
      if (response.data.success) {
        setDocuments(response.data.data);
      }
    } catch (error) {
      showNotification('Error fetching documents', 'error');
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        showNotification('File uploaded successfully!', 'success');
        fetchDocuments(); // Refresh the list
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error uploading file';
      showNotification(message, 'error');
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file download
  const handleDownload = async (id, filename) => {
    try {
      const response = await axios.get(`${API_URL}/documents/${id}`, {
        responseType: 'blob',
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showNotification('File downloaded successfully!', 'success');
    } catch (error) {
      showNotification('Error downloading file', 'error');
      console.error('Error downloading file:', error);
    }
  };

  // Handle file delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(`${API_URL}/documents/${id}`);

      if (response.data.success) {
        showNotification('Document deleted successfully!', 'success');
        fetchDocuments(); // Refresh the list
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error deleting document';
      showNotification(message, 'error');
      console.error('Error deleting document:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🏥 Patient Portal</h1>
          <p>Medical Document Management System</p>
        </header>

        {notification.show && (
          <Notification message={notification.message} type={notification.type} />
        )}

        <FileUpload onUpload={handleUpload} loading={loading} />

        <FileList
          documents={documents}
          onDownload={handleDownload}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;
