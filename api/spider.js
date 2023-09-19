require('dotenv').config();

const express = require('express');
const router = express.Router();

const Article = require('../models/Article');
const Subscription = require('../models/Subscription');

/* ====================================================== */
/*   @route     GET api/spider/subscriptions              */
/*   @desc      Get list of all possible subscriptions    */
/*   @access    Private                                    */
/* ====================================================== */

router.get('/subscriptions', async (req, res) => {
  try {
    if (req.header('spider') !== process.env.SPIDER_SECRET) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const find = { enabled: '1' };
    const select = '-id -enabled -subscribers -__v';
    const sort = { site: 'asc', section: 'asc' };

    const subscriptions = await Subscription.find(find).select(select).sort(sort);
    return res.status(200).json({ data: subscriptions });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;

/* ====================================================== */
/*   @route     GET api/spider/urls                       */
/*   @desc      Get list of urls from all articles        */
/*   @access    Private                                   */
/* ====================================================== */

router.get('/urls', async (req, res) => {
  try {
    if (req.header('spider') !== process.env.SPIDER_SECRET) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const articles = await Article.find({});
    const urls = articles.map((article) => {
      // return `${article.site}|${article.section}|${article.url}`;
      return `${article.url}`;
    });

    return res.status(200).json({ data: urls });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

/* ====================================================== */
/*   @route     POST api/spider/articles                  */
/*   @desc      Save to DB articles collected by spider   */
/*   @access    Private                                   */
/* ====================================================== */

router.post('/articles', async (req, res) => {
  try {
    if (req.header('spider') !== process.env.SPIDER_SECRET) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const subscriptions = await Subscription.find({});

    const makeArticles = async () => {
      const articles = [];

      // Taking data from json array of req.body and creating articles
      req.body.forEach((item) => {
        const article = new Article({ ...item });

        // Taking users array from subscriptions and assign it for every article
        subscriptions.forEach((sub) => {
          if (article.site === sub.site && article.section === sub.section) {
            article.unreaded_by = sub.subscribers;
          }
        });

        articles.push(article);
      });

      return articles;
    };

    const articles = await makeArticles();
    await Article.insertMany(articles);
    return res.status(200).json({ msg: 'Success.' });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

/*
(await) Article.updateMany( {}, { $rename: { topic: 'section' } }, { multi: true } )
const Article = require("../models/Article.js")
*/
