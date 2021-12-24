const fs = require('fs/promises')
const path = require('path')
const { v4 } = require('uuid')
const contactsPath = path.join(__dirname, 'contacts.json')

const updateContacts = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
}

const listContacts = async () => {
  const data = await fs.readFile(contactsPath)
  const contacts = JSON.parse(data)
  return contacts
}

const getContactById = async (id) => {
  const contacts = await listContacts()
  const result = contacts.find((contact) => String(contact.id) === id)
  if (!result) {
    return null
  }
  return result
}

const addContact = async (body) => {
  const newContact = { id: v4(), ...body }
  const contacts = await listContacts()
  contacts.push(newContact)
  await updateContacts(contacts)

  return newContact
}

const updateContact = async (id, body) => {
  const contacts = await listContacts()
  const idx = contacts.findIndex((item) => String(item.id) === id)
  if (idx === -1) {
    return null
  }
  contacts[idx] = { id: id, ...body }
  await updateContacts(contacts)
  return contacts[idx]
}

const removeContact = async (id) => {
  const contacts = await listContacts()
  const idx = contacts.findIndex((contact) => String(contact.id) === id)
  if (idx === -1) {
    return null
  }
  const removeContact = contacts.splice(idx, 1)
  await updateContacts(contacts)
  return removeContact
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContacts,
  updateContact,
}
