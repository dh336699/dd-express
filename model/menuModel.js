const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const menuSchema = new mongoose.Schema({
  menuName: {
    type: String,
    required: true,
  },
  ...baseModel
})

module.exports = menuSchema