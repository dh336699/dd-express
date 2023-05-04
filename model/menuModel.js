const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const menuSchema = new mongoose.Schema({
  menuName: {
    type: String,
    required: true,
  },
  goodsList: [{
    goods: {
      type: mongoose.ObjectId,
      required: false,
      ref: 'Goods'
    },
  }],
  sort: {
    type: Number,
    required: false,
  },
  ...baseModel
})

module.exports = menuSchema