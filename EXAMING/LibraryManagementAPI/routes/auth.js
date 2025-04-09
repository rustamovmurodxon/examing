const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendOtp, verifyOtp } = require('../services/otp');
const bcrypt = require('bcrypt');
require('dotenv').config();

let lastOtp = null;  

router.post(
  '/signup',
  [
    body('email').isEmail(),
    body('username').notEmpty(),
    body('password').isLength({ min: 6 }),
    body('confirmPassword').custom((value, { req }) => value === req.body.password),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { email, username, password, role = 'user', firstName, lastName } = req.body;
      const user = await User.create({ email, username, password, role, firstName, lastName });
      lastOtp = await sendOtp();  
      res.json({ message: 'User created', userId: user.id, otpSent: true, otp: lastOtp });
    } catch (error) {
      res.status(500).json({ message: 'Server xatosi', error: error.message });
    }
  }
);

router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (verifyOtp(lastOtp, otp)) {
      await User.activate(userId);
      res.json({ message: 'OTP verified, account activated' });
    } else {
      res.status(400).json({ message: 'Notogri OTP' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password)) || user.status !== 'active') {
      return res.status(401).json({ message: 'Notogri email, parol yoki hisob faol emas' });
    }
    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET);
    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

router.get('/logout', auth, (req, res) => {
  res.json({ message: 'Logout successful' });
});

router.post('/refresh-token', (req, res) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ id: decoded.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(401).json({ message: 'Notogri refresh token' });
  }
});

module.exports = router;