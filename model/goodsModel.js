const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const goodsSchema = new mongoose.Schema({
  originalPrice: {
    type: Number,
    required: false,
  },
  minPrice: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    required: false,
  },
  stores: {
    type: Number,
    required: true,
  },
  minBuyNumber: {
    type: Number,
    requried: false
  },
  content: {
    type: String,
    requried: false
  },
  delete: {
    type: Boolean,
    default: false
  },
  ...baseModel
})

module.exports = goodsSchema