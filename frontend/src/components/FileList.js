import React from 'react';
import './FileList.css';

function FileList({ documents, onDownload, onDelete, loading }) {
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading && documents.length === 0) {
    return (
      <div className="file-list-section">
        <h2>📋 Your Documents</h2>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="file-list-section">
      <h2>📋 Your Documents</h2>

      {documents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <p>No documents uploaded yet</p>
          <p className="empty-hint">Upload your first medical document to get started</p>
        </div>
      ) : (
        <div className="documents-grid">
          {documents.map((doc) => (
            <div key={doc.id} className="document-card">
              <div className="document-icon">📄</div>
              <div className="document-info">
                <h3 className="document-name">{doc.originalName}</h3>
                <div className="document-meta">
                  <span className="meta-item">
                    💾 {formatFileSize(doc.filesize)}
                  </span>
                  <span className="meta-item">
                    📅 {formatDate(doc.created_at)}
                  </span>
                </div>
              </div>
              <div className="document-actions">
                <button
                  onClick={() => onDownload(doc.id, doc.originalName)}
                  className="action-button download-button"
                  title="Download"
                >
                  ⬇️ Download
                </button>
                <button
                  onClick={() => onDelete(doc.id)}
                  className="action-button delete-button"
                  title="Delete"
                  disabled={loading}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileList;
