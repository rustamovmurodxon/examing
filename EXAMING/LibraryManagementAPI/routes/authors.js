const express = require('express');
const router = express.Router();
const Author = require('../models/Author');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');

router.post('/', auth, checkRole('admin', 'librarian'), async (req, res) => {
  const author = await Author.create(req.body);
  res.json({ authorId: author.id, message: 'Author created' });
});

router.get('/', async (req, res) => {
  const authors = await Author.findAll();
  res.json(authors);
});

router.get('/:id', async (req, res) => {
  const author = await Author.findById(req.params.id);
  res.json(author);
});

router.put('/:id', auth, checkRole('admin', 'librarian'), async (req, res) => {
  const author = await Author.update(req.params.id, req.body);
  res.json({ authorId: author.id, message: 'Author updated' });
});

router.delete('/:id', auth, checkRole('admin', 'librarian'), async (req, res) => {
  await Author.delete(req.params.id);
  res.json({ message: 'Author deleted' });
});

module.exports = router;