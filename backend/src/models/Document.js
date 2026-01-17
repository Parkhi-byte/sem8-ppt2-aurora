import mongoose from 'mongoose';

const documentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true, // e.g., 'pdf', 'doc', 'image'
    },
    size: {
        type: String, // e.g., '2.4 MB'
        required: true,
    },
    url: {
        type: String, // In a real app, this would be S3 URL. For now, a mock or local path.
        required: true,
    },
    folder: {
        type: String,
        default: 'General',
    },
}, {
    timestamps: true,
});

const Document = mongoose.model('Document', documentSchema);

export default Document;
