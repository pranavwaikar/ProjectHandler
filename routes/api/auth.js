const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../models/User');
const logger = require('../../config/logger');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ errors: [{ msg: 'server error' }] });
  }
});

// @route   POST api/auth
// @desc    authenticate users and get tokens
// @access  Public

router.post(
  '/',
  [
    check('email', 'Email is not valid').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email: email });

      if (!user) {
        res.status(400).json({ errors: [{ msg: 'invalid crdentials!' }] });
      }

      const isMatched = await bcrypt.compare(password, user.password);

      if (!isMatched) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'invalid crdentials!' }] });
      }
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: config.get('JWTExpiresIn') },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({ token });
        }
      );
    } catch (error) {
      logger.error('Unable to fetch user record from database - ', error);
      res.status(500).send({ errors: [{ msg: 'server error' }] });
    }
  }
);

module.exports = router;
