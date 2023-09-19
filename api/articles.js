const express = require('express');
const router = express.Router();

const checkToken = require('../middleware/check-token');
const Article = require('../models/Article');

/* ====================================================== */
/*   @route 1   GET api/articles/unreaded                 */
/*   @route 2   GET api/articles/saved                    */
/*   @desc      Get all articles where user written       */
/*   @access    Private                                   */
/* ====================================================== */

router.get(['/unreaded', '/saved'], checkToken, async (req, res) => {
  try {
    const field = req.url.includes('/unreaded') ? 'unreaded_by' : 'saved_by';

    const find = { [field]: { $in: req.user.id } };
    const select = '-unreaded_by -saved_by';
    const sort = { site: 'asc', section: 'asc', title: 'asc' };
    // const sort = { title: 'asc' };

    const articles = await Article.find(find).select(select).sort(sort);
    return res.status(200).json({ data: articles });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

/* ========================================================== */
/*   @route1    PUT api/articles/unreaded/hide/:id            */
/*   @route2    PUT api/articles/unreaded/save/:id            */
/*   @route3    PUT api/articles/saved/hide/:id               */
/*   @desc      Delete or move post by it's ID                */
/*   @access    Private                                       */
/* ========================================================== */

const actionRoutes = [
  '/unreaded/hide/:id',
  '/unreaded/save/:id',
  '/saved/hide/:id',
];

router.put(actionRoutes, checkToken, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    let update = '';

    if (req.url.includes('/unreaded/hide')) {
      update = {
        $pull: { unreaded_by: req.user.id },
      };
    }

    if (req.url.includes('/unreaded/save')) {
      update = {
        $pull: { unreaded_by: req.user.id },
        $push: { saved_by: req.user.id },
      };
    }

    if (req.url.includes('/saved/hide')) {
      update = {
        $pull: { saved_by: req.user.id },
      };
    }

    await Article.findByIdAndUpdate(req.params.id, update);
    return res.status(200).json({ msg: 'Success.' });

  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Article not found.' });
    }
    return res.status(500).json({ error: 'Server error.' });
  }
});


module.exports = router;

/*
function generateDateInUTC() {
  let strDate = new Date().toISOString();
  strDate = strDate.split('.')[0];
  strDate = strDate.replace("T", " ") + '.000000';
  return strDate;
}
*/
