import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
  email:          { type: String, unique: true, required: true, trim: true },
  emailLowercase: { type: String, unique: true, trim: true, lowercase: true },
  password:       { type: String, required: true, trim: true },
  admin:          { type: Boolean, default: false },
  subscriptions:  [{ type: Schema.Types.ObjectId, ref: 'Source' }],
  bannedStrings:  [{ type: String, required: true }],
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
    bannedStrings,
    tokens,
    createdAt,
    updatedAt,
    ...rest
  } = this.toObject();

  return rest;
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

const User = models.User || model('User', userSchema);
export default User;