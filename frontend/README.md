# Frontend - Patient Portal

React-based frontend application for the Patient Portal, allowing patients to upload, view, download, and delete their medical documents.

## Technology Stack

- **Framework**: React 18
- **HTTP Client**: Axios
- **Styling**: CSS3 with modern features
- **Build Tool**: Create React App

## Features

- 📤 **File Upload**: Drag-and-drop or click to upload PDF files
- 📋 **Document List**: View all uploaded documents in a clean grid layout
- ⬇️ **Download**: Download any document with a single click
- 🗑️ **Delete**: Remove documents with confirmation
- ✅ **Validation**: Client-side file type and size validation
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations

## Project Structure

```
frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/
│   │   ├── FileUpload.js   # File upload component
│   │   ├── FileUpload.css
│   │   ├── FileList.js     # Document list component
│   │   ├── FileList.css
│   │   ├── Notification.js # Toast notification component
│   │   └── Notification.css
│   ├── App.js              # Main application component
│   ├── App.css
│   ├── index.js            # Application entry point
│   └── index.css           # Global styles
├── package.json
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

### Development mode:
```bash
npm start
```

The app will open automatically at `http://localhost:3000`

### Build for production:
```bash
npm build
```

Creates an optimized production build in the `build/` directory.

## Configuration

### API Endpoint

The frontend connects to the backend API at `http://localhost:5000/api`

This is configured in `package.json` via the proxy setting:
```json
"proxy": "http://localhost:5000"
```

To change the backend URL, update the `API_URL` constant in `src/App.js`:
```javascript
const API_URL = 'http://localhost:5000/api';
```

## Components

### FileUpload Component
- Handles file selection and validation
- Supports drag-and-drop
- Shows file size and name
- Validates PDF format and 10MB size limit

### FileList Component
- Displays all uploaded documents
- Shows file metadata (name, size, upload date)
- Provides download and delete actions
- Empty state when no documents exist
- Loading state while fetching data

### Notification Component
- Shows success/error messages
- Auto-dismisses after 3 seconds
- Animated slide-in effect
- Positioned at top-right corner

## File Validation

### Client-side validation:
- **File Type**: Only PDF files (`.pdf`)
- **File Size**: Maximum 10MB
- **MIME Type**: `application/pdf`

## Browser Compatibility

The application works on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Responsive Design

Breakpoints:
- Desktop: > 768px
- Mobile: ≤ 768px

The UI adapts seamlessly to different screen sizes with optimized layouts for each device type.

## Error Handling

The app handles various error scenarios:
- Network errors (backend not running)
- File upload failures
- Download errors
- Delete operation failures
- Invalid file types
- File size exceeded

All errors display user-friendly messages via the notification system.

## Development Tips

### Hot Reload
Changes to code will automatically reload the browser during development.

### React DevTools
Install React DevTools browser extension for better debugging.

### Console Logging
Check browser console for detailed error messages during development.

## API Integration

The frontend communicates with the backend via these endpoints:

| Action | Method | Endpoint |
|--------|--------|----------|
| Upload | POST | `/api/documents/upload` |
| List | GET | `/api/documents` |
| Download | GET | `/api/documents/:id` |
| Delete | DELETE | `/api/documents/:id` |

## Styling

The application uses:
- CSS Grid for responsive layouts
- Flexbox for component alignment
- CSS animations for smooth transitions
- Linear gradients for modern appearance
- Box shadows for depth perception

## Future Enhancements

Potential improvements:
- File preview before upload
- PDF viewer integration
- Search and filter functionality
- Sorting options
- Pagination for large document lists
- Bulk operations
- Progress bar during upload
- Document categories/tags
