const express = require('express');
const router = express.Router();

const {
  listContactsController,
  getContactByIdController,
  removeContactController,
  addContactController,
  updateContactController,
} = require('../../controllers');

router.get('/', listContactsController);

router.get('/:contactId', getContactByIdController);

router.post('/', addContactController);

router.delete('/:contactId', removeContactController);

router.put('/:contactId', updateContactController);

module.exports = router;
