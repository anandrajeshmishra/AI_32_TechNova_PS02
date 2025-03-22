const express = require('express');
const KnowledgeBase = require('../models/KnowledgeBase');

const router = express.Router();

// Get all knowledge base entries
router.get('/', async (req, res) => {
    const kbEntries = await KnowledgeBase.find();
    res.json(kbEntries);
});

// Add new knowledge base entry
router.post('/', async (req, res) => {
    const newEntry = new KnowledgeBase(req.body);
    await newEntry.save();
    res.status(201).json({ message: 'Knowledge Base entry added' });
});

// Update knowledge base entry
router.put('/:id', async (req, res) => {
    await KnowledgeBase.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Knowledge Base entry updated' });
});

// Delete knowledge base entry
router.delete('/:id', async (req, res) => {
    await KnowledgeBase.findByIdAndDelete(req.params.id);
    res.json({ message: 'Knowledge Base entry deleted' });
});

module.exports = router;
