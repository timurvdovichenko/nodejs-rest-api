const express = require('express');
const router = express.Router();

const {
  listContactsController,
  getContactByIdController,
  removeContactController,
  addContactController,
  updateContactController,
} = require('../../controllers');
const {
  isValidId,
  validateBody,
  validateFavoriteBody,
  authenticate,
} = require('../../middlewares');
const { updateFavoriteController } = require('../../controllers/contactsController');

const { schemaJoiValidation, updateFovoriteJoiValidation } = require('../../schemas/contactSchema');

router.get('/', authenticate, listContactsController);

router.get('/:contactId', authenticate, isValidId, getContactByIdController);

router.post('/', authenticate, validateBody(schemaJoiValidation), addContactController);

router.delete('/:contactId', authenticate, isValidId, removeContactController);

router.patch(
  '/:contactId/favorite',
  authenticate,
  isValidId,
  validateFavoriteBody(updateFovoriteJoiValidation),
  updateFavoriteController,
);

router.put(
  '/:contactId',
  authenticate,
  isValidId,
  validateBody(schemaJoiValidation),
  updateContactController,
);

module.exports = router;
