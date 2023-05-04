const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User'
  },
  menu: [{
    goods: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goods',
      required: true
    },
    number: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
  }],
  total: {
    type: Number,
    required: true
  },
  ...baseModel
})

module.exports = orderSchema