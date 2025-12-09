# Backend - Patient Portal API

Backend API service for the Patient Portal application, handling medical document uploads, storage, and management.

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **File Upload**: Multer
- **CORS**: Enabled for frontend communication

## Project Structure

```
backend/
├── server.js           # Main application entry point
├── database.js         # SQLite database configuration
├── routes/
│   └── documents.js    # Document management routes
├── uploads/            # Directory for uploaded files
├── package.json        # Dependencies
└── database.db         # SQLite database file (created on first run)
```

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### 1. Upload Document
- **URL**: `/api/documents/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**: FormData with `file` field (PDF only)
- **Success Response**: 201
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

### 2. List All Documents
- **URL**: `/api/documents`
- **Method**: `GET`
- **Success Response**: 200
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

### 3. Download Document
- **URL**: `/api/documents/:id`
- **Method**: `GET`
- **Success Response**: 200 (Binary PDF file)

### 4. Delete Document
- **URL**: `/api/documents/:id`
- **Method**: `DELETE`
- **Success Response**: 200
  ```json
  {
    "success": true,
    "message": "Document deleted successfully"
  }
  ```

### 5. Health Check
- **URL**: `/api/health`
- **Method**: `GET`
- **Success Response**: 200
  ```json
  {
    "success": true,
    "message": "Server is running",
    "timestamp": "2025-12-09T10:30:00.000Z"
  }
  ```

## Example API Calls

### Upload a file (cURL)
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -F "file=@/path/to/your/document.pdf"
```

### List all documents
```bash
curl http://localhost:5000/api/documents
```

### Download a document
```bash
curl http://localhost:5000/api/documents/1 --output downloaded.pdf
```

### Delete a document
```bash
curl -X DELETE http://localhost:5000/api/documents/1
```

## Database Schema

### documents table
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

## Configuration

### File Upload Limits
- Maximum file size: 10MB
- Allowed file types: PDF only (application/pdf)
- Storage location: `./uploads/` directory

### Port Configuration
Default port is 5000. Can be changed by setting the `PORT` environment variable:
```bash
PORT=8080 npm start
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

Common error codes:
- `400`: Bad request (invalid file type, no file uploaded)
- `404`: Resource not found (document doesn't exist)
- `500`: Server error (database or filesystem issues)

## Development Notes

- The `uploads/` directory is automatically created on server start
- Database is automatically initialized with required schema
- Files are stored with timestamp prefix to ensure uniqueness
- CORS is enabled for all origins (development only)

## Dependencies

- **express**: Web framework
- **cors**: CORS middleware
- **multer**: File upload handling
- **sqlite3**: SQLite database driver
- **nodemon**: Development auto-reload (dev dependency)
