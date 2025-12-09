import React, { useState } from 'react';
import './FileUpload.css';

function FileUpload({ onUpload, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  // Validate file type and size
  const validateAndSetFile = (file) => {
    if (!file) {
      return;
    }

    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed');
      return;
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    onUpload(selectedFile);
    setSelectedFile(null); // Reset after upload

    // Reset file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="file-upload-section">
      <h2>📄 Upload Medical Document</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <div
          className={`drop-zone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="fileInput"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={loading}
            className="file-input"
          />
          <label htmlFor="fileInput" className="file-label">
            <div className="upload-icon">📤</div>
            <p className="upload-text">
              {selectedFile
                ? `Selected: ${selectedFile.name}`
                : 'Click to browse or drag and drop a PDF file'}
            </p>
            {selectedFile && (
              <p className="file-size">{formatFileSize(selectedFile.size)}</p>
            )}
            <p className="upload-hint">Maximum file size: 10MB</p>
          </label>
        </div>

        <button
          type="submit"
          disabled={!selectedFile || loading}
          className="upload-button"
        >
          {loading ? '⏳ Uploading...' : '📤 Upload Document'}
        </button>
      </form>
    </div>
  );
}

export default FileUpload;
