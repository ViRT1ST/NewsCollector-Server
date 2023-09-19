const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
  site: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  unreaded_by: {
    type: [String],
  },
  saved_by: {
    type: [String],
  },
});

module.exports = mongoose.model('article', ArticleSchema);
