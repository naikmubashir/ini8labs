# Patient Portal - Design Document

## 1. Tech Stack Choices

### Q1. Frontend Framework: **React**

**Why React?**
- **Component-based architecture**: Allows building reusable UI components (upload form, file list, file item)
- **Large ecosystem**: Rich set of libraries for file uploads, HTTP requests (axios), and UI components
- **Virtual DOM**: Efficient rendering for dynamic file list updates
- **Hooks**: Modern React hooks (useState, useEffect) make state management straightforward
- **Developer experience**: Excellent tooling with Create React App/Vite for quick setup

### Q2. Backend Framework: **Express.js (Node.js)**

**Why Express?**
- **Lightweight and flexible**: Minimal overhead, easy to understand and extend
- **Excellent middleware support**: Easy to integrate file upload handling (multer), CORS, error handling
- **JavaScript everywhere**: Using JavaScript on both frontend and backend simplifies development
- **Large community**: Well-documented, many solutions available for common problems
- **npm ecosystem**: Rich package ecosystem for file handling, database connectivity, validation

### Q3. Database: **SQLite**

**Why SQLite?**
- **Zero configuration**: No server setup required, perfect for local development
- **Self-contained**: Single file database, easy to share and backup
- **Sufficient for requirements**: Handles metadata storage efficiently for this use case
- **Easy to upgrade**: Can migrate to PostgreSQL/MySQL later without major code changes

**When to use PostgreSQL instead:**
- Multiple concurrent users (production environment)
- Better ACID compliance needs
- Advanced querying and indexing requirements
- Proper user authentication and multi-tenancy

### Q4. Scaling to 1,000 Users - Required Changes

**Infrastructure Changes:**
1. **Database**: Migrate from SQLite to PostgreSQL/MySQL with connection pooling
2. **File Storage**: Move from local filesystem to cloud storage (AWS S3, Azure Blob Storage, Google Cloud Storage)
   - Enables horizontal scaling
   - Better durability and availability
   - CDN integration for faster downloads
3. **Authentication & Authorization**: Implement proper user management
   - JWT-based authentication
   - Role-based access control
   - Each user sees only their documents
4. **API Gateway**: Add rate limiting, request throttling, and load balancing
5. **Caching**: Implement Redis for metadata caching
6. **CDN**: Use CDN for serving static files and document downloads
7. **Monitoring**: Add logging, monitoring, and alerting (e.g., CloudWatch, DataDog)
8. **Backend Scaling**: Deploy multiple backend instances behind a load balancer
9. **Database Optimizations**: 
   - Add indexes on frequently queried fields (user_id, created_at)
   - Implement database read replicas
10. **Security Enhancements**:
    - HTTPS everywhere
    - Input validation and sanitization
    - File scanning for malware
    - Implement file size limits and quotas per user

## 2. Architecture Overview

### High-Level Architecture

```
┌─────────────────┐
│   React Client  │
│   (Frontend)    │
└────────┬────────┘
         │ HTTP/REST
         │ (axios)
         ▼
┌─────────────────┐
│  Express.js API │
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

### Component Flow

1. **Frontend (React)**
   - User interface components
   - HTTP client (axios) for API calls
   - File input handling and validation
   - Display file list with actions

2. **Backend (Express.js)**
   - RESTful API endpoints
   - Multer middleware for file uploads
   - File system operations
   - Database operations (CRUD)
   - Error handling and validation

3. **Database (SQLite)**
   - Stores file metadata
   - Single `documents` table

4. **File Storage (Local)**
   - `uploads/` directory
   - Stores actual PDF files

### Request Flow Example (Upload)

```
User → React UI → FormData → POST /documents/upload 
→ Express → Multer (save file) → SQLite (save metadata) 
→ Response → Update UI
```

## 3. API Specification

### Base URL
```
http://localhost:5000/api
```

### 1. Upload a PDF

**Endpoint:** `POST /api/documents/upload`

**Description:** Upload a new PDF document

**Request:**
- Content-Type: `multipart/form-data`
- Body: FormData with file field

```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -F "file=@/path/to/document.pdf"
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": 1,
    "filename": "prescription.pdf",
    "originalName": "prescription.pdf",
    "filepath": "uploads/1733745600000-prescription.pdf",
    "filesize": 245678,
    "created_at": "2025-12-09T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Only PDF files are allowed"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Error uploading file",
  "error": "Error details"
}
```

---

### 2. List All Documents

**Endpoint:** `GET /api/documents`

**Description:** Retrieve all uploaded documents metadata

**Request:**
```bash
curl -X GET http://localhost:5000/api/documents
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "filename": "prescription.pdf",
      "originalName": "prescription.pdf",
      "filesize": 245678,
      "created_at": "2025-12-09T10:30:00.000Z"
    },
    {
      "id": 2,
      "filename": "test-results.pdf",
      "originalName": "test-results.pdf",
      "filesize": 512340,
      "created_at": "2025-12-09T11:15:00.000Z"
    }
  ]
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Error fetching documents"
}
```

---

### 3. Download a File

**Endpoint:** `GET /api/documents/:id`

**Description:** Download a specific document by ID

**Request:**
```bash
curl -X GET http://localhost:5000/api/documents/1 \
  --output downloaded-file.pdf
```

**Success Response (200):**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="prescription.pdf"`
- Body: Binary PDF file

**Error Response (404):**
```json
{
  "success": false,
  "message": "Document not found"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Error downloading file"
}
```

---

### 4. Delete a File

**Endpoint:** `DELETE /api/documents/:id`

**Description:** Delete a document and its metadata

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/documents/1
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Document not found"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Error deleting document"
}
```

## 4. Data Flow Description

### Q5. File Upload Process

**Step-by-step flow:**

1. **User Action**: User selects a PDF file and clicks "Upload" button in React UI
2. **Frontend Validation**: React validates file type (PDF only) on client side
3. **FormData Creation**: JavaScript creates FormData object with the file
4. **HTTP Request**: Axios sends POST request to `/api/documents/upload` with multipart/form-data
5. **Backend Reception**: Express receives request, routes to upload endpoint
6. **Multer Processing**: 
   - Multer middleware intercepts the request
   - Validates file type (PDF)
   - Generates unique filename (timestamp + original name)
   - Saves file to `uploads/` directory
7. **File System Write**: Physical file is written to disk
8. **Database Insert**: 
   - Backend extracts file metadata (name, size, path)
   - Inserts record into SQLite `documents` table
   - Gets auto-generated ID
9. **Response Generation**: Backend creates JSON response with file metadata
10. **Response Sent**: HTTP 201 response sent back to frontend
11. **UI Update**: React receives response and updates file list display
12. **User Feedback**: Success message shown to user

### File Download Process

**Step-by-step flow:**

1. **User Action**: User clicks "Download" button on a file in the list
2. **Frontend Request**: React/axios sends GET request to `/api/documents/:id`
3. **Backend Route**: Express routes to download endpoint with document ID
4. **Database Query**: 
   - Backend queries SQLite for document metadata by ID
   - Retrieves filename and filepath
5. **File Existence Check**: Backend verifies file exists on filesystem
6. **Response Headers**: Backend sets appropriate headers:
   - `Content-Type: application/pdf`
   - `Content-Disposition: attachment; filename="original-name.pdf"`
7. **File Stream**: Backend streams file content as response body
8. **Frontend Reception**: Browser receives file stream
9. **Browser Action**: Browser triggers download dialog or opens PDF
10. **User Action**: User saves file to their device

## 5. Assumptions

### Q6. Assumptions Made

1. **Single User**: 
   - No authentication/authorization implemented
   - All documents belong to one user
   - No user management system

2. **File Size Limits**:
   - Maximum file size: 10MB per upload
   - Can be configured via multer settings
   - No total storage quota implemented

3. **File Types**:
   - Only PDF files are accepted
   - Validation on both frontend and backend
   - MIME type checking: `application/pdf`

4. **Concurrency**:
   - Single-threaded Node.js process
   - SQLite handles basic concurrent reads
   - No distributed locks or queue system
   - File operations are synchronous

5. **Error Handling**:
   - Basic error messages returned to frontend
   - No detailed logging system
   - No retry mechanisms

6. **Security**:
   - No file content scanning
   - No rate limiting
   - CORS enabled for local development
   - No HTTPS (local development only)
   - No input sanitization beyond basic validation

7. **Storage**:
   - Files stored locally on server filesystem
   - No backup or redundancy
   - No cleanup of old files
   - Unlimited storage (depends on disk space)

8. **Database**:
   - SQLite database file in project root
   - No migrations system
   - No backups
   - Schema created on startup

9. **Network**:
   - Running on localhost
   - Default ports: Frontend (3000), Backend (5000)
   - No load balancing
   - No CDN

10. **Data Validation**:
    - Filename length limits (255 characters)
    - No special character sanitization in filenames
    - No duplicate filename handling (timestamp makes unique)

11. **Performance**:
    - No caching layer
    - No pagination on file list
    - All files loaded at once
    - No compression

12. **Maintenance**:
    - No automatic cleanup of orphaned files
    - No database vacuum/optimization
    - Manual database resets if needed

## Implementation Notes

### Technology Versions Used
- Node.js: v18+ recommended
- React: v18+
- Express: v4+
- SQLite3: v5+

### Development Setup
- Frontend runs on `http://localhost:3000`
- Backend runs on `http://localhost:5000`
- CORS configured to allow frontend-backend communication

### Future Enhancements (Not Implemented)
- User authentication and multi-tenancy
- File preview functionality
- Search and filter capabilities
- File versioning
- Share/collaborate features
- Audit logging
- Bulk operations (upload/delete multiple files)
