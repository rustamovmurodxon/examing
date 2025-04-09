const express = require('express');
const router = express.Router();
const Borrow = require('../models/Borrow');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');

router.post('/', auth, checkRole('admin', 'librarian', 'user'), async (req, res) => {
  const borrow = await Borrow.create(req.body);
  res.json({ borrowId: borrow.id, message: 'Borrow created' });
});

router.get('/', auth, checkRole('admin', 'librarian'), async (req, res) => {
  const borrows = await Borrow.findAll();
  res.json(borrows);
});

router.get('/:id', auth, checkRole('admin', 'librarian', 'user'), async (req, res) => {
  const borrow = await Borrow.findById(req.params.id);
  res.json(borrow);
});

router.put('/:id', auth, checkRole('admin', 'librarian'), async (req, res) => {
  const borrow = await Borrow.update(req.params.id, req.body);
  res.json({ borrowId: borrow.id, message: 'Borrow updated' });
});

router.delete('/:id', auth, checkRole('admin', 'librarian'), async (req, res) => {
  await Borrow.delete(req.params.id);
  res.json({ message: 'Borrow deleted' });
});

module.exports = router;