const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const DB_HOST =
  'mongodb+srv://shpachynska:LYjW7CxBTD8YCSQZ@cluster0.flbal.mongodb.net/contact_book?retryWrites=true&w=majority'
const app = express()
mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log('database connect success')
  })
  .catch((error) => {
    console.log(error.message)
    process.exit(1)
  })

const contactsRouter = require('./routes/api/contacts')

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err
  res.status(status).json({ message })
})

module.exports = app
