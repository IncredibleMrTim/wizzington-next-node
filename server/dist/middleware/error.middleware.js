"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    console.error('Error:', err);
    // Multer errors
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 5MB' });
        }
        return res.status(400).json({ error: err.message });
    }
    // Custom errors
    if (err.message) {
        return res.status(400).json({ error: err.message });
    }
    // Default error
    res.status(500).json({ error: 'Internal server error' });
}
