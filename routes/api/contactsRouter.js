const express = require('express');
const router = express.Router();

const {
  listContactsController,
  getContactByIdController,
  removeContactController,
  addContactController,
  updateContactController,
} = require('../../controllers');
const { isValidId } = require('../../middlewares');
const { updateFavoriteController } = require('../../controllers/contactsController');

router.get('/', listContactsController);

router.get('/:contactId', isValidId, getContactByIdController);

router.post('/', addContactController);

router.delete('/:contactId', isValidId, removeContactController);

router.patch('/:contactId/favorite', isValidId, updateFavoriteController);

router.put('/:contactId', isValidId, updateContactController);

module.exports = router;
