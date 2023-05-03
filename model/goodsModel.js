const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const goodsSchema = new mongoose.Schema({
  originalPrice: {
    type: Number,
    required: true,
  },
  minPrice: {
    type: Number,
    required: false,
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
  ...baseModel
})

module.exports = goodsSchema