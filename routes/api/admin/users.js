const express = require('express');
const router = express.Router();
const authAdmin = require('../../../middleware/authAdmin');
const logger = require('../../../config/logger');

const User = require('../../models/User');

// @route   GET api/admin/users
// @desc    Get all projects
// @access  Private
router.get('/', authAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send('server error');
  }
});

module.exports = router;
