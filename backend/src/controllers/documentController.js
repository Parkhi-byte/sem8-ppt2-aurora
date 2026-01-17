import asyncHandler from 'express-async-handler';
import Document from '../models/Document.js';

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
const getDocuments = asyncHandler(async (req, res) => {
    const documents = await Document.find({ user: req.user.id });
    res.json(documents);
});

// @desc    Upload document (Mock)
// @route   POST /api/documents
// @access  Private
const uploadDocument = asyncHandler(async (req, res) => {
    const { name, type, size, folder } = req.body;

    if (!name || !type || !size) {
        res.status(400);
        throw new Error('Please include all fields');
    }

    const document = await Document.create({
        user: req.user.id,
        name,
        type,
        size,
        url: 'https://example.com/mock-file.pdf', // Mock URL
        folder: folder || 'General',
    });

    res.status(201).json(document);
});

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        res.status(404);
        throw new Error('Document not found');
    }

    // Check user
    if (document.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await document.deleteOne();

    res.json({ id: req.params.id });
});

export { getDocuments, uploadDocument, deleteDocument };
