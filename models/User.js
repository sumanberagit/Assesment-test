const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Invalid email format'],
    },
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 20 },
    password: { type: String, required: true, minlength: 8 },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v) => /^\d{10}$/.test(v),
        message: 'Phone number must be exactly 10 digits',
      },
    },
    address: {
      street: { type: String, required: false, trim: true },
      city: { type: String, required: false, trim: true },
      state: { type: String, required: false, trim: true },
      zipCode: {
        type: String,
        required: true,
        validate: {
          validator: (v) => /^\d{5}$/.test(v),
          message: 'Zip code must be exactly 5 digits',
        },
      },
    },
    dateOfBirth: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value < new Date(),
        message: 'Date of birth cannot be in the future',
      },
    },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
    profileImage: {
      type: String,
      validate: {
        validator: (v) => /^(http|https):\/\/.*\.(jpg|jpeg|png|gif)$/i.test(v),
        message: 'Invalid image URL format',
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
