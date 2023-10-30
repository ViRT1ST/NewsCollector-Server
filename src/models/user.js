const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email:          { type: String, unique: true, required: true, trim: true },
  emailLowercase: { type: String, unique: true, trim: true, lowercase: true },
  password:       { type: String, required: true, trim: true },
  admin:          { type: Boolean, default: false },
  subscriptions:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Source' }],
  tokens:         [{ type: String, required: true }],
}, {
  timestamps: true,
});

// Delete unnecessary fields before converting user to JSON
userSchema.methods.toJSON = function () {
  const {
    __v,
    emailLowercase,
    password,
    admin,
    tokens,
    createdAt,
    updatedAt,
    ...rest
  } = this.toObject();

  return rest;
};

// Generate token and update array with allowed tokens
userSchema.methods.generateAuthToken = async function () {
  const nowDateInSeconds = Math.floor(Date.now() / 1000);
  const exp = nowDateInSeconds + parseInt(process.env.JWT_EXP_SECONDS, 10);

  const payload = { exp, _id: this._id.toString() };
  const token = jwt.sign(payload, process.env.JWT_SECRET);

  this.tokens = [...this.tokens, token];
  await this.save();

  return token;
};

// Update data before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('email')) {
    this.emailLowercase = this.email.toLowerCase();
  }

  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password.trim(), 8);
  }

  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
