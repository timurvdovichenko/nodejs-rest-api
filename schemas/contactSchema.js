const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');
const Joi = require('joi');

const schemaJoiValidation = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),
  favorite: Joi.boolean(),
});

const updateFovoriteJoiValidation = Joi.object({
  favorite: Joi.boolean().required(),
});

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  { versionKey: false, timestamps: true },
);

contactSchema.post('save', handleMongooseError);

const Contact = model('contacts', contactSchema);

module.exports = { Contact, schemaJoiValidation, updateFovoriteJoiValidation };
