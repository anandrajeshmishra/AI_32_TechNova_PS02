const express = require('express');
const ChatHistory = require('../models/ChatHistory');
const KnowledgeBase = require('../models/KnowledgeBase');

const router = express.Router();

// Process user message
router.post('/message', async (req, res) => {
    const { userId, message } = req.body;

    // Find knowledge base match
    const kbEntry = await KnowledgeBase.findOne({
        $or: [
            { question: { $regex: message, $options: 'i' } },
            { tags: { $in: message.split(' ') } }
        ]
    });

    let response = kbEntry ? kbEntry.answer : "I'm not sure about that. Let me check for you!";

    // Save to chat history
    await ChatHistory.updateOne(
        { userId },
        { $push: { messages: [{ role: 'user', content: message }, { role: 'bot', content: response }] } },
        { upsert: true }
    );

    res.json({ response });
});

module.exports = router;
