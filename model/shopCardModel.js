const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const shopCarSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User'
  },
  goods: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'Goods'
  },
  name: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  sort: {
    type: Number,
    required: false,
  },
  ...baseModel
})

module.exports = shopCarSchema