const { HttpError, controllerWrapper } = require('../helpers');
const {
  Contact,
  schemaJoiValidation,
  updateFovoriteJoiValidation,
} = require('../schemas/contactSchema');

const listContactsController = async (req, res, next) => {
  const result = await Contact.find({}, '-createdAt -updatedAt');
  res.json(result);
};

const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  const result = await Contact.findById(contactId);

  if (!result) {
    throw HttpError(404, 'Not Found');
  }
  res.status(200).json(result);
};

const removeContactController = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);

  if (!result) {
    throw HttpError(404, 'Not Found');
  }

  res.status(200).json(result);
};

const addContactController = async (req, res) => {
  const { error } = schemaJoiValidation.validate(req.body);

  if (error) {
    const errorField = error.details[0].path[0];
    throw HttpError(400, `missing required (${errorField}) field`);
  }

  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const updateContactController = async (req, res) => {
  const { error } = schemaJoiValidation.validate(req.body);

  if (error) {
    throw HttpError(400, `missing fields`);
  }

  const { contactId } = req.params;

  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

  if (!result) {
    throw HttpError(404, 'Not Found');
  }

  res.status(200).json(result);
};

const updateFavoriteController = async (req, res) => {
  const { error } = updateFovoriteJoiValidation.validate(req.body);

  if (error) {
    throw HttpError(400, `missing field favorite`);
  }

  const { contactId } = req.params;

  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

  if (!result) {
    throw HttpError(400, 'Not Found');
  }

  res.status(200).json(result);
};

module.exports = {
  listContactsController: controllerWrapper(listContactsController),
  getContactByIdController: controllerWrapper(getContactByIdController),
  removeContactController: controllerWrapper(removeContactController),
  addContactController: controllerWrapper(addContactController),
  updateContactController: controllerWrapper(updateContactController),
  updateFavoriteController: controllerWrapper(updateFavoriteController),
};
