const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const tableSchema = new mongoose.Schema({
  tableNo: {
    type: Number || String,
    required: true,
  },
  status: {
    type: String,
    enum: ['empty', 'serving'],
    default: 'empty',
    required: false,
  },
  orderList: [
    {
      type: mongoose.ObjectId,
      required: false,
      ref: 'Order',
    }
  ],
  ...baseModel
})

module.exports = tableSchema