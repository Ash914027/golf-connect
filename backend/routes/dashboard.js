const express = require('express');
const Subscription = require('../models/Subscription');
const { Charity, UserCharity } = require('../models/Charity');
const Score = require('../models/Score');
const { Draw, DrawParticipant, Winnings } = require('../models/Draw');
const auth = require('../middleware/auth');

const router = express.Router();

// Get dashboard data
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get subscription status
    const subscription = await Subscription.findByUserId(userId);
    
    // Get selected charity
    const userCharity = await UserCharity.findByUserId(userId);
    
    // Get recent scores
    const scores = await Score.findByUserId(userId, 5);
    
    // Get score stats
    const stats = await Score.getUserStats(userId);
    
    // Get draw participation
    const drawParticipation = await DrawParticipant.findByUserId(userId);
    
    // Get winnings
    const winnings = await Winnings.findByUserId(userId);
    const totalWinnings = await Winnings.getTotalWinnings(userId);
    
    // Get available charities
    const charities = await Charity.findAll();
    
    // Get upcoming draws
    const upcomingDraws = await Draw.findUpcoming();
    
    res.json({
      subscription,
      selectedCharity: userCharity,
      recentScores: scores,
      scoreStats: stats,
      drawParticipation,
      winnings,
      totalWinnings,
      availableCharities: charities,
      upcomingDraws
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add score
router.post('/scores', auth, async (req, res) => {
  try {
    const { score, course, date_played } = req.body;
    const userId = req.user.id;
    
    const result = await Score.create({ user_id: userId, score, course, date_played });
    res.status(201).json({ message: 'Score added successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Select charity
router.post('/charity', auth, async (req, res) => {
  try {
    const { charity_id } = req.body;
    const userId = req.user.id;
    
    await UserCharity.create(userId, charity_id);
    res.json({ message: 'Charity selected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Join draw
router.post('/draws/:drawId/join', auth, async (req, res) => {
  try {
    const { drawId } = req.params;
    const userId = req.user.id;
    
    // Check if draw exists and is active
    const draw = await Draw.findById(drawId);
    if (!draw || draw.status === 'completed') {
      return res.status(400).json({ message: 'Draw not available' });
    }
    
    await DrawParticipant.create(drawId, userId);
    res.json({ message: 'Joined draw successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;