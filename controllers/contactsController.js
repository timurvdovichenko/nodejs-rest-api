const { HttpError, controllerWrapper } = require('../helpers');
const { Contact } = require('../schemas/contactSchema');

const listContactsController = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;

  if (favorite) {
    const result = await Contact.find({ owner, favorite }, '-createdAt -updatedAt');
    res.json(result);
    return;
  }
  const result = await Contact.find({ owner }, '-createdAt -updatedAt', { skip, limit });
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
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateContactController = async (req, res) => {
  const { contactId } = req.params;

  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

  if (!result) {
    throw HttpError(404, 'Not Found');
  }

  res.status(200).json(result);
};

const updateFavoriteController = async (req, res) => {
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
