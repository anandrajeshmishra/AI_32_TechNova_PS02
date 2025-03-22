const mongoose = require('mongoose');

const KnowledgeBaseSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, required: true },
    tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('KnowledgeBase', KnowledgeBaseSchema);
