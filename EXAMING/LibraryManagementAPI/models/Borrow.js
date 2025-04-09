const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class Borrow {
  static async create({ bookId, userId, borrowDate, dueDate }) {
    const id = uuidv4();
    const result = await pool.query(
      'INSERT INTO borrows (id, book_id, user_id, borrow_date, due_date, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, bookId, userId, borrowDate, dueDate, 'borrowed']
    );
    await pool.query('UPDATE books SET available_copies = available_copies - 1 WHERE id = $1', [bookId]);
    return result.rows[0];
  }

  static async findAll() {
    const result = await pool.query('SELECT * FROM borrows');
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM borrows WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async update(id, { returnDate, status }) {
    const result = await pool.query(
      'UPDATE borrows SET return_date = $1, status = $2 WHERE id = $3 RETURNING *',
      [returnDate, status, id]
    );
    if (status === 'returned') {
      const borrow = result.rows[0];
      await pool.query('UPDATE books SET available_copies = available_copies + 1 WHERE id = $1', [borrow.book_id]);
    }
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM borrows WHERE id = $1', [id]);
  }
}

module.exports = Borrow;