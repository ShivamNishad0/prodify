const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');

// @route   GET api/messages/users
// @desc    Get all users (potential contacts)
// @access  Private
router.get('/users', auth, async (req, res) => {
  try {
    // Return all users except the current one
    const users = await User.findAll({
      where: {
        id: { [Op.ne]: req.user.id }
      },
      attributes: ['id', 'name', 'email'],
      order: [['name', 'ASC']]
    });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/messages/:userId
// @desc    Get conversation with a specific user
// @access  Private
router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.id, recipientId: req.params.userId },
          { senderId: req.params.userId, recipientId: req.user.id },
        ],
      },
      order: [['createdAt', 'ASC']] // Oldest first
    });

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/messages
// @desc    Send a message
// @access  Private
router.post('/', auth, async (req, res) => {
  const { recipient, content } = req.body;

  try {
    const message = await Message.create({
      senderId: req.user.id,
      recipientId: recipient,
      content,
    });

    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
