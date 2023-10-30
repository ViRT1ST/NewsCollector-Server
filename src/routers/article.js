const express = require('express');
const { Types: { ObjectId } } = require('mongoose');

const Article = require('../models/article');
const auth = require('../middleware/auth');
const sendSuccessResponse = require('../responses/success');
const ExtendedError = require('../errors/exterror');
const ET = require('../errors/thrower');

const router = new express.Router();

router.post('/articles', auth, async (req, res, next) => {
  const { user, body: articles } = req;

  try {
    ET.checkUserIsAdmin(user);

    const requiredFields = ['site', 'section', 'title', 'url', 'sourceId'];
    const allowedFields = ['site', 'section', 'title', 'url', 'sourceId'];

    articles.forEach((item) => {
      const providedFields = Object.keys(item);
      ET.checkRequiredFieldsAreProvided(requiredFields, providedFields);
      ET.checkAlowedFieldsAreProvided(allowedFields, providedFields);
      item.sourceId = new ObjectId(item.sourceId);
    });

    const result = await Article.create(articles);

    sendSuccessResponse(201, result, res);
  } catch (error) {
    next(error);
  }
});

router.get('/articles/urls', auth, async (req, res, next) => {
  const { user } = req;

  try {
    ET.checkUserIsAdmin(user);

    const articles = await Article.find({}).select('url');
    const urls = articles.map((article) => article.url);

    sendSuccessResponse(200, urls, res);
  } catch (error) {
    next(error);
  }
});

router.get(/\/articles\/(unreaded|saved)/, auth, async (req, res, next) => {
  const { user: { _id }, params: { '0' : unreadedOrSaved } } = req;

  try {
    const arrField = unreadedOrSaved === 'saved' ? 'savedBy' : 'unreadedBy';
    const find = { [arrField]: { $in: _id } };
    const sort = { site: 'asc', section: 'asc', title: 'asc' };
    const articles = await Article.find(find).sort(sort);

    sendSuccessResponse(200, articles, res);
  } catch (error) {
    next(error);
  }
});

router.patch('/articles/:id/save', auth, async (req, res, next) => {
  const { params: { id: _id }, user: { _id: uid } } = req;

  try {
    // remove user id from unreadedBy and add it to savedBy
    const update = { $pull: { unreadedBy: uid }, $addToSet: { savedBy: uid } };
    const article = await Article.findByIdAndUpdate(_id, update);

    if (!article) {
      throw new ExtendedError(404, 'Article not found');
    }

    sendSuccessResponse(200, undefined, res);
  } catch (error) {
    next(error);
  }
});

router.patch('/articles/:id/hide', auth, async (req, res, next) => {
  const { params: { id: _id }, user: { _id: uid } } = req;

  try {
    // remove user id from both arrays
    const update = { $pull: { unreadedBy: uid, savedBy: uid } };
    const article = await Article.findByIdAndUpdate(_id, update);

    if (!article) {
      throw new ExtendedError(404, 'Article not found');
    }

    sendSuccessResponse(200, undefined, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
