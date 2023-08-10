const Joi = require('joi');
const contactsMethods = require('../models/contacts');
const { HttpError, controllerWrapper } = require('../helpers');

const addSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),
});

const listContactsController = async (req, res, next) => {
  const result = await contactsMethods.listContacts();
  console.log('test :>> ');
  res.json(result);
};

const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await contactsMethods.getContactById(contactId);

  if (!result) {
    throw HttpError(404, 'Not Found');
  }
  res.status(200).json(result);
};

const removeContactController = async (req, res) => {
  const { contactId } = req.params;
  const result = await contactsMethods.removeContact(contactId);

  if (!result) {
    throw HttpError(404, 'Not Found');
  }

  res.status(200).json(result);
};

const addContactController = async (req, res) => {
  const { error } = addSchema.validate(req.body);

  if (error) {
    const errorField = error.details[0].path[0];
    throw HttpError(400, `missing required ${errorField} field`);
  }

  const result = await contactsMethods.addContact(req.body);
  res.status(201).json(result);
};

const updateContactController = async (req, res) => {
  const { error } = addSchema.validate(req.body);

  if (error) {
    throw HttpError(400, `missing fields`);
  }

  const { contactId } = req.params;

  const result = await contactsMethods.updateContact(contactId, req.body);

  if (!result) {
    throw HttpError(404, 'Not Found');
  }

  res.status(200).json(result);
};

module.exports = {
  listContactsController: controllerWrapper(listContactsController),
  getContactByIdController: controllerWrapper(getContactByIdController),
  removeContactController: controllerWrapper(removeContactController),
  addContactController: controllerWrapper(addContactController),
  updateContactController: controllerWrapper(updateContactController),
};
