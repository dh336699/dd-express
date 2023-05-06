const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const tableSchema = new mongoose.Schema({
  tableNo: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['empty', 'serving'],
    default: 'empty',
    required: false,
  },
  ...baseModel
})

module.exports = tableSchema