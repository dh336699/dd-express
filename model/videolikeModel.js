const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const videolikeSchema = new mongoose.Schema({
  video: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'Video'
  },
  user: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User'
  },
  like: {
    type: Number,
    enum: [1, -1],
    required: true
  },
  ...baseModel
})

module.exports = videolikeSchema