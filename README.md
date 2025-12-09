# 🏥 Patient Portal - Medical Document Management System

A full-stack web application that allows patients to upload, manage, download, and delete their medical documents (PDFs). This project demonstrates a complete healthcare document management solution with a modern React frontend and robust Express.js backend.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Express%20%7C%20SQLite-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Overview

This application provides a patient portal where users can:
- ✅ Upload PDF medical documents (prescriptions, test results, referral notes)
- 📋 View all uploaded documents with metadata
- ⬇️ Download documents when needed
- 🗑️ Delete documents that are no longer needed

## 🏗️ Architecture

```
┌─────────────────┐
│   React Client  │  (Port 3000)
│   (Frontend)    │
└────────┬────────┘
         │ HTTP/REST
         │ (axios)
         ▼
┌─────────────────┐
│  Express.js API │  (Port 5000)
│   (Backend)     │
└────┬───────┬────┘
     │       │
     │       └──────────────┐
     ▼                      ▼
┌──────────┐      ┌──────────────────┐
│  SQLite  │      │  Local FileSystem│
│ Database │      │   (uploads/)     │
└──────────┘      └──────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **React** 18.2.0 - UI library for building interactive interfaces
- **Axios** 1.6.0 - HTTP client for API requests
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** 4.18.2 - Web framework
- **Multer** 1.4.5 - File upload middleware
- **SQLite3** 5.1.6 - Lightweight database
- **CORS** 2.8.5 - Cross-origin resource sharing

### Database Schema
```sql
CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  originalName TEXT NOT NULL,
  filepath TEXT NOT NULL,
  filesize INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 📁 Project Structure

```
patient-portal/
├── design.md                  # Design document with architecture and decisions
├── README.md                  # This file
├── backend/                   # Backend API service
│   ├── server.js             # Express server
│   ├── database.js           # SQLite configuration
│   ├── routes/
│   │   └── documents.js      # Document API routes
│   ├── uploads/              # Uploaded files directory
│   ├── package.json
│   └── README.md
└── frontend/                  # React frontend application
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── FileUpload.js
    │   │   ├── FileList.js
    │   │   └── Notification.js
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- A terminal/command prompt
- A modern web browser

### Installation & Setup

#### 1. Clone or Download the Repository

```bash
# Navigate to the project directory
cd patient-portal
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
npm start
```

The backend server will start on `http://localhost:5000`

You should see:
```
Connected to SQLite database
Documents table ready
Created uploads directory
Server running on http://localhost:5000
```

#### 3. Frontend Setup (Open a new terminal)

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend will automatically open at `http://localhost:3000`

### ✅ Verify Installation

1. **Backend Health Check**:
   ```bash
   curl http://localhost:5000/api/health
   ```
   Expected response:
   ```json
   {
     "success": true,
     "message": "Server is running",
     "timestamp": "2025-12-09T10:30:00.000Z"
   }
   ```

2. **Frontend**: Open browser to `http://localhost:3000` - you should see the Patient Portal interface.

## 📖 Usage Guide

### Uploading a Document

1. Click the upload area or drag-and-drop a PDF file
2. Only PDF files up to 10MB are accepted
3. Click "Upload Document" button
4. Success notification will appear
5. Document appears in the list below

### Downloading a Document

1. Find the document in the list
2. Click the "Download" button
3. File will be saved to your downloads folder

### Deleting a Document

1. Find the document in the list
2. Click the "Delete" button
3. Confirm the deletion in the popup
4. Document is removed from both database and storage

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Upload Document
```http
POST /api/documents/upload
Content-Type: multipart/form-data

Body: FormData with 'file' field
```

**Example (cURL)**:
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -F "file=@/path/to/document.pdf"
```

**Success Response (201)**:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": 1,
    "filename": "1733745600000-prescription.pdf",
    "originalName": "prescription.pdf",
    "filepath": "uploads/1733745600000-prescription.pdf",
    "filesize": 245678,
    "created_at": "2025-12-09T10:30:00.000Z"
  }
}
```

#### 2. List All Documents
```http
GET /api/documents
```

**Example (cURL)**:
```bash
curl http://localhost:5000/api/documents
```

**Success Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "filename": "1733745600000-prescription.pdf",
      "originalName": "prescription.pdf",
      "filepath": "uploads/1733745600000-prescription.pdf",
      "filesize": 245678,
      "created_at": "2025-12-09T10:30:00.000Z"
    }
  ]
}
```

#### 3. Download Document
```http
GET /api/documents/:id
```

**Example (cURL)**:
```bash
curl http://localhost:5000/api/documents/1 --output document.pdf
```

**Success Response (200)**: Binary PDF file stream

#### 4. Delete Document
```http
DELETE /api/documents/:id
```

**Example (cURL)**:
```bash
curl -X DELETE http://localhost:5000/api/documents/1
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

## 🧪 Testing with Postman

### Import into Postman

1. Create a new collection: "Patient Portal API"
2. Add requests for each endpoint

### Example Postman Tests

**Upload**:
- Method: POST
- URL: `http://localhost:5000/api/documents/upload`
- Body: form-data
- Key: `file` (type: File)
- Value: Select a PDF file

**List All**:
- Method: GET
- URL: `http://localhost:5000/api/documents`

**Download**:
- Method: GET
- URL: `http://localhost:5000/api/documents/1`
- Send and Download: Save response

**Delete**:
- Method: DELETE
- URL: `http://localhost:5000/api/documents/1`

## 🎨 Features

### Frontend Features
- **Drag & Drop Upload**: Intuitive file upload interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Validation**: Client-side file type and size checks
- **Toast Notifications**: Success/error messages with animations
- **Loading States**: Visual feedback during operations
- **Empty States**: Clear messaging when no documents exist
- **Modern UI**: Gradient designs, smooth animations, icons

### Backend Features
- **RESTful API**: Clean, standardized endpoints
- **File Validation**: Server-side PDF and size validation
- **Error Handling**: Comprehensive error responses
- **Database Integration**: Persistent metadata storage
- **File Management**: Automatic file naming and storage
- **CORS Support**: Cross-origin requests enabled

## 🔒 Security Considerations

**Current Implementation** (Development/Local):
- No authentication (single user assumption)
- CORS enabled for all origins
- No encryption (HTTP only)
- No rate limiting

**Production Recommendations**:
- Implement JWT authentication
- Enable HTTPS/TLS
- Add rate limiting
- Scan uploaded files for malware
- Implement user sessions
- Add CSRF protection
- Sanitize file names
- Use environment variables for config

## ⚙️ Configuration

### Backend Configuration

**Port**: Default 5000
```bash
PORT=8080 npm start
```

**File Upload Limits**: `backend/routes/documents.js`
```javascript
limits: {
  fileSize: 10 * 1024 * 1024 // 10MB
}
```

### Frontend Configuration

**API URL**: `frontend/src/App.js`
```javascript
const API_URL = 'http://localhost:5000/api';
```

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Verify Node.js is installed: `node --version`
- Delete `node_modules` and run `npm install` again

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings in `backend/server.js`
- Verify API_URL in `frontend/src/App.js`

### File upload fails
- Check file is a valid PDF
- Verify file size is under 10MB
- Check backend `uploads/` directory permissions
- Look at backend console for error messages

### Database errors
- Delete `database.db` file and restart backend (will recreate)
- Check file permissions in backend directory

## 📚 Documentation

- **Design Document**: See `design.md` for architecture, tech stack choices, and API specification
- **Backend README**: See `backend/README.md` for API details
- **Frontend README**: See `frontend/README.md` for component documentation

## 🎯 Future Enhancements

### Immediate Improvements
- [ ] User authentication and authorization
- [ ] Multi-user support with user isolation
- [ ] File preview functionality
- [ ] Search and filter documents
- [ ] Pagination for document list

### Scalability
- [ ] Migrate to PostgreSQL
- [ ] Cloud storage (AWS S3, Azure Blob)
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Load balancing
- [ ] Caching layer (Redis)

### Features
- [ ] Document categories/tags
- [ ] Share documents with doctors
- [ ] Document expiry dates
- [ ] Bulk upload/download
- [ ] Email notifications
- [ ] Audit logging

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the design document
3. Check backend/frontend README files
4. Look at console logs for error details

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the simple yet powerful backend framework
- SQLite for the easy-to-use database
- All open-source contributors

---

**Note**: This application is designed for local development and demonstration purposes. Additional security measures and infrastructure setup would be required for production deployment.
