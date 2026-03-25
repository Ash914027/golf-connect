const db = require('../config/database');

class Score {
  static async findByUserId(userId, limit = 10) {
    const sql = 'SELECT * FROM scores WHERE user_id = ? ORDER BY date_played DESC LIMIT ?';
    
    return new Promise((resolve, reject) => {
      db.execute(sql, [userId, limit], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async create(scoreData) {
    const { user_id, score, course, date_played } = scoreData;
    const sql = 'INSERT INTO scores (user_id, score, course, date_played) VALUES (?, ?, ?, ?)';
    const values = [user_id, score, course, date_played];
    
    return new Promise((resolve, reject) => {
      db.execute(sql, values, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getUserStats(userId) {
    const sql = `
      SELECT 
        COUNT(*) as total_rounds,
        AVG(score) as average_score,
        MIN(score) as best_score,
        MAX(date_played) as last_played
      FROM scores 
      WHERE user_id = ?
    `;
    
    return new Promise((resolve, reject) => {
      db.execute(sql, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }
}

module.exports = Score;