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
  type: {
    type: String,
    enum: ['ts', 'order'],
    required: true
  },
  tableNo: {
    type: mongoose.Mixed,
    required: false
  },
  address: {
    type: mongoose.ObjectId,
    required: false,
    ref: 'Address'
  },
  status: {
    type: String,
    enum: ['init', 'confirm'],
    required: false
  },
  total: {
    type: Number,
    required: true
  },
  ...baseModel
})

module.exports = orderSchema