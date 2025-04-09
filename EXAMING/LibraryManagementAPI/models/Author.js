const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class Author {
  static async create({ firstName, lastName, biography, dateOfBirth, nationality }) {
    const id = uuidv4();
    const result = await pool.query(
      'INSERT INTO authors (id, first_name, last_name, biography, date_of_birth, nationality) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, firstName, lastName, biography, dateOfBirth, nationality]
    );
    return result.rows[0];
  }

  static async findAll() {
    const result = await pool.query('SELECT * FROM authors');
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async update(id, { firstName, lastName, biography, dateOfBirth, nationality }) {
    const result = await pool.query(
      'UPDATE authors SET first_name = $1, last_name = $2, biography = $3, date_of_birth = $4, nationality = $5 WHERE id = $6 RETURNING *',
      [firstName, lastName, biography, dateOfBirth, nationality, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM authors WHERE id = $1', [id]);
  }
}

module.exports = Author;