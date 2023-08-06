const fs = require('fs/promises');
const { nanoid } = require('nanoid');
const path = require('path');

const contactsPath = path.join(__dirname, 'contacts.json');

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async contactId => {
  const contacts = await listContacts();
  const data = contacts.find(({ id }) => id === contactId);
  return data || null;
};

const removeContact = async contactId => {
  const contacts = await listContacts();
  const indexContact = contacts.findIndex(({ id }) => id === contactId);
  if (indexContact === -1) {
    return null;
  }
  const removedContact = contacts.splice(indexContact, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return removedContact || null;
};

const addContact = async body => {
  const { name, email, phone } = body;
  const contacts = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };
  contacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact || null;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const indexContact = contacts.findIndex(({ id }) => id === contactId);
  if (indexContact === -1) {
    return null;
  }
  contacts[indexContact] = { id: contactId, ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[indexContact] || null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
