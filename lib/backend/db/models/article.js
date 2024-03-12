import { Schema, model, models } from 'mongoose';
import User from './user';

const articleSchema = new Schema({
  site:       { type: String, required: true, trim: true },
  section:    { type: String, required: true, trim: true },
  title:      { type: String, required: true, trim: true },
  url:        { type: String, required: true, trim: true },
  sourceId:   { type: Schema.Types.ObjectId, ref: 'Source' },
  unreadedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  savedBy:    [{ type: Schema.Types.ObjectId, ref: 'User' }],
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

  // fill unreadedBy by subscribers that don't have banned keywords in title
  const title = this.title.toLowerCase();
  this.unreadedBy = subscribersToSource
    .filter((user) => !user.bannedStrings.some((s) => title.includes(s)))
    .map((user) => user._id);

  next();
});

const Article = models.Article || model('Article', articleSchema);
export default Article;