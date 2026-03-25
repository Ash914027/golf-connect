const db = require('../config/database');

class Subscription {
  static async findByUserId(userId) {
    const sql = 'SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1';
    
    return new Promise((resolve, reject) => {
      db.execute(sql, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  static async create(subscriptionData) {
    const { user_id, type, start_date, end_date } = subscriptionData;
    const sql = 'INSERT INTO subscriptions (user_id, type, start_date, end_date) VALUES (?, ?, ?, ?)';
    const values = [user_id, type, start_date, end_date];
    
    return new Promise((resolve, reject) => {
      db.execute(sql, values, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}

module.exports = Subscription;