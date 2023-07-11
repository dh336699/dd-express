const mongoose = require('mongoose')
const md5 = require('../util/md5')
const baseModel = require('./baseModel')
const userSchema = new mongoose.Schema({
  openId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    set: value => md5(value),
    select: false
  },
  address: {
    type: String
  },
  avatar: {
    type: String,
    default: null
  },
  orderAuth: {
    type: String,
    default: 'init',
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isManager: {
    type: Boolean,
    default: false
  },
  ...baseModel
})

module.exports = userSchema