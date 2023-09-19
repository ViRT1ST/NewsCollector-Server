require('dotenv').config();

const express = require('express');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

const checkToken = require('../middleware/check-token');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

/* ====================================================== */
/*   Common functions                                     */
/* ====================================================== */

function createClientToken(id, email) {
  const payload = { id, email };
  const options = { expiresIn: parseInt(process.env.JWT_EXPIRATION, 10) };
  const secret = process.env.JWT_SECRET;
  return jwt.sign(payload, secret, options);
}

/* ====================================================== */
/*   @route     POST api/users/register                   */
/*   @desc      Register a user                           */
/*   @access    Public                                    */
/* ====================================================== */

router.post('/register', async (req, res) => {
  // Check user inputs for errors and limitations
  if (!validator.isEmail(req.body.email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (!validator.isLength(req.body.password, { min: 8 })) {
    return res.status(400).json({ error: 'Please enter a password with 8 or more characters.' });
  }

  // Destruct user inputs
  const { email, password } = req.body;

  try {
    // Check if the user is already registered (ignore email letter case)
    const condition = { email };
    const collation = { locale: 'en', strength: 2 };

    const foundUser = await User.findOne(condition).collation(collation);
    if (foundUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // Generating hashed password by bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating user for DB (password firld must be 'password');
    const newUser = new User({ email, password: hashedPassword });
    console.log(newUser);

    // Saving user to DB
    await newUser.save();

    // Adding user to all subscriptions
    await Subscription.updateMany({}, { $push: { subscribers: newUser.id } });

    // Return JSON Web Token
    const token = createClientToken(newUser.id, newUser.email);
    return res.status(200).json({ data: { token } });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

/* ====================================================== */
/*   @route     POST api/users/login                      */
/*   @desc      Login user and get token                  */
/*   @access    Public                                    */
/* ====================================================== */

router.post('/login', async (req, res) => {
  // Check user inputs for errors and limitations
  if (!validator.isEmail(req.body.email)) {
    return res.status(400).json({ error: 'Email is required for login.' });
  }
  if (!validator.isLength(req.body.password, { min: 1 })) {
    return res.status(400).json({ error: 'Password is required for login.' });
  }

  // Destruct user inputs
  const { email, password } = req.body;

  try {
    // Check if the user is already registered (ignore email letter case)
    const condition = { email };
    const collation = { locale: 'en', strength: 2 };
    const foundUser = await User.findOne(condition).collation(collation);
    if (!foundUser) {
      return res.status(400).json({ error: 'The username or password you entered is incorrect.' });
    }

    // Check if the user password is matches
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'The username or password you entered is incorrect.' });
    }

    // Return JSON Web Token
    const token = createClientToken(foundUser.id, foundUser.email);
    return res.status(200).json({ data: { token } });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

/* ====================================================== */
/*   @route     GET api/users/me/info                     */
/*   @desc      Get user information from server          */
/*   @access    Private                                   */
/* ====================================================== */

router.get('/me/info', checkToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -date -__v');
    return res.status(200).json({ data: user });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

/* ====================================================== */
/*   @route     GET api/users/me/profile                  */
/*   @desc      Get user profile from server              */
/*   @access    Private                                   */
/* ====================================================== */

router.get('/me/profile', checkToken, async (req, res) => {
  try {
    let userSubscriptions = [];

    const find = { enabled: '1' };
    const sort = { site: 'asc', section: 'asc' };
    const result = await Subscription.find(find).sort(sort);

    if (!result.length) {
      return res.status(500).json({ error: 'Server error.' });
    }

    userSubscriptions = result.map((item) => {
      const { _id, site, section, url } = item;

      return {
        _id,
        site,
        section,
        url,
        is_subscribed: item.subscribers.includes(req.user.id),
      };
    });

    const response = {
      subscriptions: userSubscriptions,
      user: req.user.id,
    };

    return res.status(200).json({ data: response });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

/* ====================================================== */
/*   @route     PUT api/users/me/profile                  */
/*   @desc      Update user profile on server             */
/*   @access    Private                                   */
/* ====================================================== */

router.put('/me/profile', checkToken, async (req, res) => {
  const formSubs = req.body.subscriptions;
  const formPassword = req.body.password;

  const formIDs = Object.keys(formSubs);
  const checkedIDs = formIDs.filter((key) => formSubs[key]);

  try {
    const result = await Subscription.find({});

    if (!result.length) {
      return res.status(500).json({ error: 'Server error.' });
    }

    result.forEach((item) => {
      const isCheckedInForm = checkedIDs.includes(String(item._id));
      const isAlreadySubscribedByUser = item.subscribers.includes(req.user.id);

      if (!isCheckedInForm) {
        item.subscribers = item.subscribers.filter((x) => x !== req.user.id);
        item.save();
      }

      if (isCheckedInForm && !isAlreadySubscribedByUser) {
        item.subscribers.push(req.user.id);
        item.save();
      }
    });

    if (formPassword.length > 7) {
      const user = await User.findById(req.user.id);
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(formPassword, salt);
      user.password = password;
      user.save();
      return res.status(200).json({ msg: 'Subscription and password were updated.' });
    }

    return res.status(200).json({ msg: 'Subscription were updated.' });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
