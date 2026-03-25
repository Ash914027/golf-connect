const db = require('../config/database');

class Charity {
  static async findAll() {
    const sql = 'SELECT * FROM charities ORDER BY name';
    
    return new Promise((resolve, reject) => {
      db.execute(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async findById(id) {
    const sql = 'SELECT * FROM charities WHERE id = ?';
    
    return new Promise((resolve, reject) => {
      db.execute(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }
}

class UserCharity {
  static async findByUserId(userId) {
    const sql = `
      SELECT uc.*, c.name, c.description 
      FROM user_charities uc 
      JOIN charities c ON uc.charity_id = c.id 
      WHERE uc.user_id = ?
    `;
    
    return new Promise((resolve, reject) => {
      db.execute(sql, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  static async create(userId, charityId) {
    const sql = 'INSERT INTO user_charities (user_id, charity_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE charity_id = ?';
    const values = [userId, charityId, charityId];
    
    return new Promise((resolve, reject) => {
      db.execute(sql, values, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}

module.exports = { Charity, UserCharity };