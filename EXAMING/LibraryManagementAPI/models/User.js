const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

class User {
  static async create({ email, username, password, role, firstName, lastName }) {
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (id, email, username, password, role, first_name, last_name, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [id, email, username, hashedPassword, role, firstName, lastName, 'inactive']
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async activate(id) {
    await pool.query('UPDATE users SET status = $1 WHERE id = $2', ['active', id]);
  }
}

module.exports = User;