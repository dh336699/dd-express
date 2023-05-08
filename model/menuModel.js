const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const menuSchema = new mongoose.Schema({
  menuName: {
    type: String,
    required: true,
  },
  goodsList: [{
    type: mongoose.ObjectId,
    required: false,
    ref: 'Goods',
  }],
  sort: {
    type: Number,
    required: true,
  },
  ...baseModel
})

module.exports = menuSchema