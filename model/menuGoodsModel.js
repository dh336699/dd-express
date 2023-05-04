const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const menuGoodsSchema = new mongoose.Schema({
  menu: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'Menu'
  },
  menuName: {
    type: String,
    required: false,
  },
  goodsList: [{
    goods: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'Goods'
    },
  }],
  ...baseModel
})

module.exports = menuGoodsSchema