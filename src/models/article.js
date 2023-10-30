const mongoose = require('mongoose');
const User = require('./user');

const articleSchema = new mongoose.Schema({
  site:       { type: String, required: true, trim: true },
  section:    { type: String, required: true, trim: true },
  title:      { type: String, required: true, trim: true },
  url:        { type: String, required: true, trim: true },
  sourceId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Source' },
  unreadedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedBy:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true,
});

// Delete unnecessary fields before converting user to JSON
articleSchema.methods.toJSON = function () {
  const {
    __v,
    unreadedBy,
    savedBy,
    updatedAt,
    ...rest
  } = this.toObject();

  return rest;
};

// Update data before saving
articleSchema.pre('save', async function (next) {
  const condition = { subscriptions: { $in: this.sourceId } };
  const subscribersToSource = await User.find(condition);

  this.unreadedBy = subscribersToSource.map((user) => user._id);

  next();
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
