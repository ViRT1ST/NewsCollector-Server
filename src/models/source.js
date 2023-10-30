const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
  site:           { type: String, required: true, trim: true },
  section:        { type: String, required: true, trim: true },
  url:            { type: String, required: true, trim: true },
  parsingMethod:  { type: String, required: true, trim: true },
  regex:          { type: String, trim: true },
  removeInTitle:  { type: String, trim: true },
  translateTitle: { type: Boolean, required: true, default: false },
  enabled:        { type: Boolean, required: true, default: false },
}, {
  timestamps: true,
});

// Delete unnecessary fields before converting user to JSON
sourceSchema.methods.toJSON = function () {
  const {
    __v,
    enabled,
    createdAt,
    updatedAt,
    ...rest
  } = this.toObject();

  return rest;
};

const Source = mongoose.model('Source', sourceSchema);
module.exports = Source;
