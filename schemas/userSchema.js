const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');
const Joi = require('joi');
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: emailRegexp,
      unique: true,
    },
    password: { type: String, minlength: 6, required: [true, 'Set password for user'] },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: { type: String, default: '' },
  },
  { versionKey: false, timestamps: true },
);

userSchema.post('save', handleMongooseError);

const registerSchema = Joi.object({
  email: Joi.string()
    .required()
    .pattern(emailRegexp)
    .messages({ '*': 'Помилка від Joi або іншої бібліотеки валідації' }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({ '*': 'Помилка від Joi або іншої бібліотеки валідації' }),
  subscription: Joi.string(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegexp)
    .required()
    .messages({ '*': 'Помилка від Joi або іншої бібліотеки валідації' }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({ '*': 'Помилка від Joi або іншої бібліотеки валідації' }),
});

const updateSubscriptionJoiValidation = Joi.object({
  subscription: Joi.string().required().valid('pro', 'starter', 'business'),
});

const User = model('users', userSchema);

module.exports = { User, registerSchema, loginSchema, updateSubscriptionJoiValidation };
