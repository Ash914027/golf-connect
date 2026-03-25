import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scoreForm, setScoreForm] = useState({ score: '', course: '', date_played: '' });
  const [selectedCharity, setSelectedCharity] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/dashboard/scores', scoreForm);
      setScoreForm({ score: '', course: '', date_played: '' });
      fetchDashboardData();
    } catch (error) {
      console.error('Error adding score:', error);
    }
  };

  const handleCharitySelect = async (charityId) => {
    try {
      await axios.post('http://localhost:5000/api/dashboard/charity', { charity_id: charityId });
      fetchDashboardData();
    } catch (error) {
      console.error('Error selecting charity:', error);
    }
  };

  const handleJoinDraw = async (drawId) => {
    try {
      await axios.post(`http://localhost:5000/api/dashboard/draws/${drawId}/join`);
      fetchDashboardData();
    } catch (error) {
      console.error('Error joining draw:', error);
    }
  };

  if (loading) {
    return (
      <div className="welcome-message">
        <h2>Loading your golf journey...</h2>
        <div style={{ fontSize: '2rem', marginTop: '1rem' }}>⛳</div>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      <div className="welcome-message">
        <h2>Your Golf Journey Awaits</h2>
        <p>Track scores, support charities, and join exciting draws</p>
      </div>

      {/* Subscribe CTA */}
      <div className="subscribe-cta">
        <h2>Level Up Your Game</h2>
        <p>Join our premium membership for exclusive draws, advanced analytics, and priority charity selections</p>
        <button className="subscribe-btn">Subscribe Now - $9.99/month</button>
      </div>

      <div className="dashboard-grid">

        {/* Subscription Status */}
        <div className="card">
          <h3>🎯 Membership Status</h3>
          {dashboardData?.subscription ? (
            <div>
              <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary-color)' }}>
                {dashboardData.subscription.status.toUpperCase()}
              </p>
              <p>Type: {dashboardData.subscription.type}</p>
              <p>Valid until: {dashboardData.subscription.end_date}</p>
            </div>
          ) : (
            <div>
              <p style={{ color: '#ff6b6b' }}>No active subscription</p>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Upgrade Now</button>
            </div>
          )}
        </div>

        {/* Score Entry */}
        <div className="card">
          <h3>📊 Enter Your Score</h3>
          <form onSubmit={handleScoreSubmit}>
            <div className="form-group">
              <label>Score</label>
              <input
                type="number"
                value={scoreForm.score}
                onChange={(e) => setScoreForm({...scoreForm, score: e.target.value})}
                required
                placeholder="Enter your score"
              />
            </div>
            <div className="form-group">
              <label>Course</label>
              <input
                type="text"
                value={scoreForm.course}
                onChange={(e) => setScoreForm({...scoreForm, course: e.target.value})}
                placeholder="Course name"
              />
            </div>
            <div className="form-group">
              <label>Date Played</label>
              <input
                type="date"
                value={scoreForm.date_played}
                onChange={(e) => setScoreForm({...scoreForm, date_played: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn">Add Score</button>
          </form>
        </div>

        {/* Selected Charity */}
        <div className="card">
          <h3>❤️ Your Charity</h3>
          {dashboardData?.selectedCharity ? (
            <div>
              <h4 style={{ color: 'var(--primary-color)' }}>{dashboardData.selectedCharity.name}</h4>
              <p>{dashboardData.selectedCharity.description}</p>
              <button
                className="btn"
                style={{ marginTop: '1rem', background: 'linear-gradient(135deg, #ff6b6b, #feca57)' }}
                onClick={() => setSelectedCharity('change')}
              >
                Change Charity
              </button>
            </div>
          ) : (
            <div>
              <p>Choose a charity to support with your game</p>
              <div className="form-group">
                <select
                  value={selectedCharity}
                  onChange={(e) => setSelectedCharity(e.target.value)}
                  style={{ marginTop: '1rem' }}
                >
                  <option value="">Select a charity</option>
                  {dashboardData?.availableCharities?.map(charity => (
                    <option key={charity.id} value={charity.id}>{charity.name}</option>
                  ))}
                </select>
              </div>
              <button
                className="btn"
                onClick={() => handleCharitySelect(selectedCharity)}
                disabled={!selectedCharity}
              >
                Select Charity
              </button>
            </div>
          )}
        </div>

        {/* Draw Participation */}
        <div className="card">
          <h3>🎲 Join the Fun</h3>
          <h4>Upcoming Draws</h4>
          {dashboardData?.upcomingDraws?.map(draw => (
            <div key={draw.id} style={{
              border: '1px solid #e1e5e9',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              background: 'var(--light-bg)'
            }}>
              <h5 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{draw.name}</h5>
              <p style={{ marginBottom: '0.5rem' }}>Draw Date: {draw.draw_date}</p>
              <button
                className="btn"
                onClick={() => handleJoinDraw(draw.id)}
                style={{ width: '100%' }}
              >
                Join Draw
              </button>
            </div>
          ))}
          <h4>Your Participations</h4>
          {dashboardData?.drawParticipation?.slice(0, 3).map(part => (
            <p key={part.id} style={{ padding: '0.5rem', background: 'var(--light-bg)', borderRadius: '4px', marginBottom: '0.5rem' }}>
              {part.name} - <span style={{ color: part.status === 'completed' ? '#4CAF50' : '#ff9800' }}>{part.status}</span>
            </p>
          ))}
        </div>

        {/* Winnings Overview */}
        <div className="card">
          <h3>🏆 Your Winnings</h3>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--accent-color)' }}>
              ${dashboardData?.totalWinnings || 0}
            </div>
            <div style={{ color: '#666' }}>Total Winnings</div>
          </div>
          <h4>Recent Winnings</h4>
          {dashboardData?.winnings?.slice(0, 3).map(win => (
            <div key={win.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.5rem',
              background: 'var(--light-bg)',
              borderRadius: '4px',
              marginBottom: '0.5rem'
            }}>
              <span>${win.amount}</span>
              <span style={{ color: '#666', fontSize: '0.9rem' }}>
                {win.draw_name} - {new Date(win.won_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>

        {/* Score Stats */}
        <div className="card">
          <h3>📈 Your Performance</h3>
          {dashboardData?.scoreStats && (
            <div className="stats">
              <div className="stat-item">
                <div className="stat-value">{dashboardData.scoreStats.total_rounds}</div>
                <div className="stat-label">Rounds Played</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{dashboardData.scoreStats.average_score?.toFixed(1) || 'N/A'}</div>
                <div className="stat-label">Average Score</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{dashboardData.scoreStats.best_score || 'N/A'}</div>
                <div className="stat-label">Best Score</div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Recent Scores */}
      <div className="card">
        <h3>📝 Recent Scores</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {dashboardData?.recentScores?.map(score => (
            <div key={score.id} style={{
              padding: '1rem',
              background: 'var(--light-bg)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--primary-color)' }}>
                {score.score}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>{score.course}</div>
              <div style={{ color: '#666', fontSize: '0.8rem' }}>{score.date_played}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button className="btn" onClick={logout} style={{ background: 'linear-gradient(135deg, #666, #999)' }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;