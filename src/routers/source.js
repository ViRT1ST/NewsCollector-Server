const express = require('express');

const Source = require('../models/source');
const auth = require('../middleware/auth');
const sendSuccessResponse = require('../responses/success');
const ET = require('../errors/thrower');

const router = new express.Router();

router.get('/sources', auth, async (req, res, next) => {
  const { user } = req;

  try {
    // ET.checkUserIsAdmin(user);

    const find = { enabled: true };
    const sort = { site: 'asc', section: 'asc' };
    const subscriptions = await Source.find(find).sort(sort);

    sendSuccessResponse(200, subscriptions, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
