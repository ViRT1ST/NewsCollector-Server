const express = require('express');
const { Types: { ObjectId } } = require('mongoose');

const Article = require('../models/article');
const User = require('../models/user');
const Source = require('../models/source');
const auth = require('../middleware/auth');
const sendSuccessResponse = require('../responses/success');
const ET = require('../errors/thrower');

const router = new express.Router();

router.post('/users', async (req, res, next) => {
  const { body } = req;

  try {
    const requiredFields = ['email', 'password'];
    const allowedFields = ['email', 'password'];
    const providedFields = Object.keys(body);
    ET.checkRequiredFieldsAreProvided(requiredFields, providedFields);
    ET.checkAlowedFieldsAreProvided(allowedFields, providedFields);

    const { email, password } = body;

    ET.checkStringIsFitting('Password', password, 8);
    ET.checkEmailIsValid(email);

    await ET.checkUserIsNotExist(email);

    const user = new User({ email, password });
    await user.save();

    const token = await user.generateAndSaveToken();

    sendSuccessResponse(201, { user, token }, res);
  } catch (error) {
    next(error);
  }
});

router.post('/users/login', async (req, res, next) => {
  let { email, password } = req.body;

  try {
    ET.checkStringIsFitting('Password', password, 8);
    ET.checkEmailIsValid(email);
    await ET.checkUserIsExist(email);

    const emailLowercase = email.toLowerCase().trim();
    const user = await User.findOne({ emailLowercase });

    ET.checkPasswordIsCorrect(password, user.password);

    const token = await user.generateAndSaveToken();

    sendSuccessResponse(200, { user, token }, res);
  } catch (error) {
    next(error);
  }
});

router.post('/users/logout', auth, async (req, res, next) => {
  const { token, user } = req;

  try {
    user.tokens = user.tokens.filter((item) => item !== token);
    await user.save();

    sendSuccessResponse(200, undefined, res);
  } catch (error) {
    next(error);
  }
});

router.post('/users/logout-all', auth, async (req, res, next) => {
  const { user } = req;

  try {
    user.tokens = [];
    await user.save();

    sendSuccessResponse(200, undefined, res);
  } catch (error) {
    next(error);
  }
});

router.get('/users/me', auth, async (req, res) => {
  const { email, _id: userId, subscriptions: userSubscriptions } = req.user;

  const find = { enabled: true };
  const sort = { site: 'asc', section: 'asc' };
  const sources = await Source.find(find).sort(sort);

  const subscriptions = sources.map(({ _id, site, section }) => {
    const isSubscribed = userSubscriptions.includes(_id);
    return { _id, site, section, isSubscribed };
  });

  sendSuccessResponse(200, { _id: userId, email, subscriptions }, res);
});

router.patch('/users/me', auth, async (req, res, next) => {
  const { user, body } = req;
  const { email, password, subscriptions } = body;

  try {
    const allowedFields = ['email', 'password', 'subscriptions'];
    const providedFields = Object.keys(body);
    await ET.checkAlowedFieldsAreProvided(allowedFields, providedFields);

    email && ET.checkEmailIsValid(email);
    // email && ET.checkIsEmailBelongToUser(email, user);
    password && ET.checkStringIsFitting('Password', password, 8);
    subscriptions && ET.checkArrayIsArray(subscriptions);

    if (subscriptions) {
      body.subscriptions = subscriptions.map((sub) => new ObjectId(sub));
    }

    providedFields.forEach((field) => {
      user[field] = body[field];
    });

    await user.save();

    sendSuccessResponse(200, user, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/users/me', auth, async (req, res, next) => {
  const { _id } = req.user;

  try {
    await Article.updateMany({}, { $pull: { unreadedBy: _id, savedBy: _id } });
    await User.findOneAndDelete({ _id });

    sendSuccessResponse(200, undefined, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
