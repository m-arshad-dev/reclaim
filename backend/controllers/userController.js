const express = require('express');
const router = express.Router();
const userService = require('../services/UserService');

router.post('/register', async (req, res) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Registration failed' });
  }
});

module.exports = router;