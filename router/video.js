const express = require('express')
const router = express.Router()
const vodController = require('../controller/vodController')
const videoController = require('../controller/videoController')
const { verifyToken } = require("../util/jwt")
const { videoValidator } = require("../middleware/validator/videoValidator")
router
  .get('/gethots/:topnum', verifyToken(), videoController.getHots)
  .get('/collect/:videoId', verifyToken(), videoController.collect)
  .get('/dislike/:videoId', verifyToken(), videoController.dislike)
  .get('/like/:videoId', verifyToken(), videoController.likevideo)
  .delete('/comment/:videoId/:commentId', verifyToken(), videoController.delcomment)
  .get('/commentList/:videoId', verifyToken(false), videoController.commentList)
  .post('/comment/:videoId', verifyToken(), videoController.comment)
  .get('/videolists', videoController.videolists)
  .get('/video/:videoId', verifyToken(false), videoController.video)
  .get('/getvod', verifyToken(), vodController.getvod)
  .post('/createvideo', verifyToken(), videoValidator, videoController.createvideo)

module.exports = router