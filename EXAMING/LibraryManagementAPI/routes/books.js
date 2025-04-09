const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');

router.post('/', auth, checkRole('admin', 'librarian'), async (req, res) => {
  const book = await Book.create(req.body);
  res.json({ bookId: book.id, message: 'Book created' });
});

router.get('/', async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
});

router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.json(book);
});

router.put('/:id', auth, checkRole('admin', 'librarian'), async (req, res) => {
  const book = await Book.update(req.params.id, req.body);
  res.json({ bookId: book.id, message: 'Book updated' });
});

router.delete('/:id', auth, checkRole('admin', 'librarian'), async (req, res) => {
  await Book.delete(req.params.id);
  res.json({ message: 'Book deleted' });
});

module.exports = router;