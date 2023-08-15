const express = require('express');
const router = express.Router();

const {
  listContactsController,
  getContactByIdController,
  removeContactController,
  addContactController,
  updateContactController,
} = require('../../controllers');
const { isValidId, validateBody, validateFavoriteBody } = require('../../middlewares');
const { updateFavoriteController } = require('../../controllers/contactsController');

const { schemaJoiValidation, updateFovoriteJoiValidation } = require('../../schemas/contactSchema');

router.get('/', listContactsController);

router.get('/:contactId', isValidId, getContactByIdController);

router.post('/', validateBody(schemaJoiValidation), addContactController);

router.delete('/:contactId', isValidId, removeContactController);

router.patch(
  '/:contactId/favorite',
  isValidId,
  validateFavoriteBody(updateFovoriteJoiValidation),
  updateFavoriteController,
);

router.put('/:contactId', isValidId, validateBody(schemaJoiValidation), updateContactController);

module.exports = router;
