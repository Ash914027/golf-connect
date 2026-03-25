const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { username, email, password, role = 'user' } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
    const values = [username, email, hashedPassword, role];

    return new Promise((resolve, reject) => {
      db.execute(sql, values, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';

    return new Promise((resolve, reject) => {
      db.execute(sql, [email], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  static async findById(id) {
    const sql = 'SELECT id, username, email, role FROM users WHERE id = ?';

    return new Promise((resolve, reject) => {
      db.execute(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  static async updateRefreshToken(id, refreshToken) {
    const sql = 'UPDATE users SET refresh_token = ? WHERE id = ?';

    return new Promise((resolve, reject) => {
      db.execute(sql, [refreshToken, id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async findByRefreshToken(refreshToken) {
    const sql = 'SELECT * FROM users WHERE refresh_token = ?';

    return new Promise((resolve, reject) => {
      db.execute(sql, [refreshToken], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }
}

module.exports = User;