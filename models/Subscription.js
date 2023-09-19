const mongoose = require('mongoose');

const SubscriptionSchema = mongoose.Schema({
  site: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  regex: {
    type: String,
    required: true,
  },
  extra_part: {
    type: String,
    required: true,
  },
  parsing_type: {
    type: String,
    required: true,
  },
  translate_title: {
    type: String,
    required: true,
  },
  enabled: {
    type: String,
    required: true,
  },
  subscribers: {
    type: [String],
  },
});

module.exports = mongoose.model('subscription', SubscriptionSchema);
