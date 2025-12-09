const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// File filter to accept only PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload a PDF file
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { filename, originalname, size, path: filepath } = req.file;

    // Insert file metadata into database
    const query = `
      INSERT INTO documents (filename, originalName, filepath, filesize)
      VALUES (?, ?, ?, ?)
    `;

    db.run(query, [filename, originalname, filepath, size], function(err) {
      if (err) {
        // Delete uploaded file if database insert fails
        fs.unlinkSync(filepath);
        return res.status(500).json({
          success: false,
          message: 'Error saving file metadata',
          error: err.message
        });
      }

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          id: this.lastID,
          filename: filename,
          originalName: originalname,
          filepath: filepath,
          filesize: size,
          created_at: new Date().toISOString()
        }
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
});

// Get all documents
router.get('/', (req, res) => {
  const query = 'SELECT * FROM documents ORDER BY created_at DESC';

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching documents',
        error: err.message
      });
    }

    res.json({
      success: true,
      data: rows
    });
  });
});

// Download a specific file
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM documents WHERE id = ?';

  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching document',
        error: err.message
      });
    }

    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const filepath = row.filepath;

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${row.originalName}"`);

    // Stream file to response
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);
  });
});

// Delete a file
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  // First, get the file info
  const selectQuery = 'SELECT * FROM documents WHERE id = ?';

  db.get(selectQuery, [id], (err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching document',
        error: err.message
      });
    }

    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const filepath = row.filepath;

    // Delete from database
    const deleteQuery = 'DELETE FROM documents WHERE id = ?';
    
    db.run(deleteQuery, [id], function(err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error deleting document from database',
          error: err.message
        });
      }

      // Delete physical file
      if (fs.existsSync(filepath)) {
        try {
          fs.unlinkSync(filepath);
        } catch (fileErr) {
          console.error('Error deleting file:', fileErr);
          // File deletion error, but database record is already deleted
          return res.json({
            success: true,
            message: 'Document deleted from database, but file removal failed',
            warning: 'Physical file may still exist'
          });
        }
      }

      res.json({
        success: true,
        message: 'Document deleted successfully'
      });
    });
  });
});

module.exports = router;
