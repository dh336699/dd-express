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
    type: Number,
    required: false
  },
  orderPerson: {
    name: {
      type: String,
      required: false
    },
    address: {
      type: String,
      required: false
    },
    mobile: {
      type: Number,
      required: false
    },
  },
  status: {
    type: String,
    enum: ['init', 'confirm'],
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  ...baseModel
})

module.exports = orderSchema