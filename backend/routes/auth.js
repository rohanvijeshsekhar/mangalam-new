const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const store   = require('../db/store');
const router  = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  const user = store.getOne('users', u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password_hash))
    return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'mt_secret', { expiresIn: '24h' });
  res.json({ token, username: user.username });
});

// POST /api/auth/change-password (protected)
router.post('/change-password', verifyToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = store.getOne('users', u => u.id === req.user.id);
  if (!bcrypt.compareSync(currentPassword, user.password_hash))
    return res.status(401).json({ error: 'Current password is incorrect' });
  store.update('users', user.id, { password_hash: bcrypt.hashSync(newPassword, 10) });
  res.json({ message: 'Password updated successfully' });
});

function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET || 'mt_secret');
    next();
  } catch {
    res.status(401).json({ error: 'Token expired or invalid' });
  }
}

module.exports = { router, verifyToken };
