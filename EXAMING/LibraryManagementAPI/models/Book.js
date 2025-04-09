const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class Book {
  static async create({ title, isbn, authorId, category, publicationDate, totalCopies }) {
    const id = uuidv4();
    const availableCopies = totalCopies;
    const result = await pool.query(
      'INSERT INTO books (id, title, isbn, author_id, category, publication_date, total_copies, available_copies) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [id, title, isbn, authorId, category, publicationDate, totalCopies, availableCopies]
    );
    return result.rows[0];
  }

  static async findAll() {
    const result = await pool.query('SELECT * FROM books');
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async update(id, { title, isbn, authorId, category, publicationDate, totalCopies }) {
    const result = await pool.query(
      'UPDATE books SET title = $1, isbn = $2, author_id = $3, category = $4, publication_date = $5, total_copies = $6 WHERE id = $7 RETURNING *',
      [title, isbn, authorId, category, publicationDate, totalCopies, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM books WHERE id = $1', [id]);
  }
}

module.exports = Book;