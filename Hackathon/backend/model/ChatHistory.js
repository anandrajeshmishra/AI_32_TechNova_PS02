const mongoose = require('mongoose');

const ChatHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messages: [
        {
            role: { type: String, enum: ['user', 'bot'], required: true },
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('ChatHistory', ChatHistorySchema);
