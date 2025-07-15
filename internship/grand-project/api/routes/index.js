const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');

router.get('/mood', async (req, res) => {
  try {
    const moods = await Mood.find().sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch moods' });
  }
});

router.post('/mood', async (req, res) => {
  try {
    const { mood, intensity, note } = req.body;
    const newMood = new Mood({ mood, intensity, note });
    const saved = await newMood.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save mood' });
  }
});

module.exports = router;
