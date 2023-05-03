const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  ...baseModel
})

module.exports = addressSchema