const db = require('../config/database');

class Draw {
  static async findUpcoming() {
    const sql = 'SELECT * FROM draws WHERE status IN ("upcoming", "active") ORDER BY draw_date';
    
    return new Promise((resolve, reject) => {
      db.execute(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async findById(id) {
    const sql = 'SELECT * FROM draws WHERE id = ?';
    
    return new Promise((resolve, reject) => {
      db.execute(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }
}

class DrawParticipant {
  static async findByUserId(userId) {
    const sql = `
      SELECT dp.*, d.name, d.draw_date, d.status 
      FROM draw_participants dp 
      JOIN draws d ON dp.draw_id = d.id 
      WHERE dp.user_id = ? 
      ORDER BY d.draw_date DESC
    `;
    
    return new Promise((resolve, reject) => {
      db.execute(sql, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async create(drawId, userId) {
    const sql = 'INSERT INTO draw_participants (draw_id, user_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE participated_at = CURRENT_TIMESTAMP';
    const values = [drawId, userId];
    
    return new Promise((resolve, reject) => {
      db.execute(sql, values, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}

class Winnings {
  static async findByUserId(userId) {
    const sql = `
      SELECT w.*, d.name as draw_name 
      FROM winnings w 
      LEFT JOIN draws d ON w.draw_id = d.id 
      WHERE w.user_id = ? 
      ORDER BY w.won_at DESC
    `;
    
    return new Promise((resolve, reject) => {
      db.execute(sql, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async getTotalWinnings(userId) {
    const sql = 'SELECT SUM(amount) as total FROM winnings WHERE user_id = ?';
    
    return new Promise((resolve, reject) => {
      db.execute(sql, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0].total || 0);
      });
    });
  }
}

module.exports = { Draw, DrawParticipant, Winnings };