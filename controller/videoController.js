const { Video, Videocomment, Videolike, CollectModel, Subscribe } = require('../model')
const { hotInc, topHosts } = require("../model/redis/redishostsinc")

// 观看 + 1  点赞 + 2  评论 + 2  收藏 + 3

// 获取热门视频
exports.getHots = async (req, res) => {
  const videoList = await topHosts(req.params.topnum)
  console.log(videoList);
  res.status(200).json(videoList)
}

// 收藏视频
exports.collect = async (req, res) => {
  const { videoId } = req.params
  const userId = req.user.userInfo._id
  const video = await Video.findById(videoId)
  if (!video) {
    return res.status(404).json({ err: '视频不存在' })
  }
  const doc = await CollectModel.findOne({ user: userId, video: videoId })
  if (doc) {
    return res.status(403).json({ msg: '视频已被收藏' })
  }
  const mycollect = await new CollectModel({ user: userId, video: videoId }).save()
  if (mycollect) {
    await hotInc(videoId, 3)
  }
  res.status(200).json({ msg: '收藏成功' })
}

// 不喜欢视频
exports.dislike = async (req, res) => {
  const { videoId } = req.params
  const userId = req.user.userInfo._id
  let isdislike = true
  const video = await Video.findById(videoId)
  if (!video) {
    return res.status(404).json({ err: '视频不存在' })
  }
  const videoLike =  await Videolike.findOne({ video: videoId, user: userId })
  if (videoLike && videoLike.like === -1) {
    await videoLike.remove()
    isdislike = false
  } else if (videoLike && videoLike.like === 1) {
    videoLike.like = -1
    await videoLike.save()
  } else {
    await new Videolike({ video: videoId, user: userId, like: -1 }).save()
  }
  video.likeCount = await Videolike.countDocuments({
    video: videoId,
    like: 1
  })

  video.dislikeCount = await Videolike.countDocuments({
    video: videoId,
    like: -1
  })
  await video.save()
  res.status(200).json({
     ...video.toJSON(),
     isdislike
  })
}

// 喜欢视频
exports.likevideo = async (req, res) => {
  const { videoId } = req.params
  const userId = req.user.userInfo._id
  let islike = true
  const video = await Video.findById(videoId)
  if (!video) {
    return res.status(404).json({ err: '视频不存在' })
  }
  const videoLike =  await Videolike.findOne({ video: videoId, user: userId })
  if (videoLike && videoLike.like === 1) {
    await videoLike.remove()
    islike = false
  } else if (videoLike && videoLike.like !== 1) {
    videoLike.like = 1
    await videoLike.save()
    await hotInc(videoId, 2)
  } else {
    await new Videolike({ video: videoId, user: userId, like: 1 }).save()
    await hotInc(videoId, 2)
  }
  video.likeCount = await Videolike.countDocuments({
    video: videoId,
    like: 1
  })

  video.dislikeCount = await Videolike.countDocuments({
    video: videoId,
    like: -1
  })
  await video.save()
  res.status(200).json({
     ...video.toJSON(),
     islike
  })
}

// 删除评论
exports.delcomment = async (req, res) => {
  const { videoId, commentId } = req.params
  // const currentUserId = req.user.userInfo._id
  // const videoComment = await Videocomment.findById(commentId).populate('user', '_id username image')
  // const videoInfo = await Video.findById(videoComment.video).populate('user', '_id username image')
  // if ((videoComment.user._id === currentUserId) || (currentUserId === videoInfo.user._id)) {
  //   await videoComment.remove()
  //   res.status(200).json({ msg: '删除评论成功' })
  // }

  // res.status(401).json({ msg: '没有权限删除' })
  try {
    const videoInfo = await Video.findById(videoId)
    if (!videoInfo) {
      res.status(404).json({ err: '视频不存在' })
    }
    const comment = await Videocomment.findById(commentId)
    if (!comment) {
      res.status(404).json({ err: '评论不存在' })
    }
    if (!comment.user.equals(req.user.userInfo._id)) {
      res.status(403).json({ err: '评论不可删除' })
    }
    await comment.remove()
    videoInfo.commentCount--
    await videoInfo.save()
    res.status(200).json({ msg: '删除评论成功' })
  } catch (error) {
    res.status(500).json(error)
  }
}

// 获取视频评论列表
exports.commentList = async (req, res) => {
  const { videoId } = req.params
  const { pageNum = 1, pageSize = 10 } = req.body
  let commentList = await Videocomment.find({ video: videoId })
                                      .skip((pageNum - 1) * pageSize)
                                      .limit(pageSize)
                                      .sort({ createAt: -1})
                                      .populate('user', '_id username image')
  const commentCount = await Videocomment.countDocuments({ video: videoId })                                    
  res.status(200).json({ commentList, commentCount })
}
// 评论视频，并且视频评论数++
exports.comment = async (req, res) => {
  const { videoId } = req.params
  const videoInfo = await Video.findById(videoId)
  if (!videoInfo) {
    return res.status(404).json({ err: '视频不存在' })
  }
  await new Videocomment({
    content: req.body.content,
    video: videoId,
    user: req.user.userInfo._id
  }).save()
  await hotInc(videoId, 2)
  videoInfo.commentCount++
  await videoInfo.save()
  res.status(201).json({ msg: '评论成功' })
}
// 获取视频列表
exports.videolists = async (req, res) => {
  let { pageNumber = 1, pageSize = 10 } = req.body

  const videoList = await Video.find()
                              .skip((pageNumber - 1) * pageSize)
                              .limit(pageSize)
                              .sort({ createAt: - 1 })
                              .populate('user')
  const getVideoCount = await Video.countDocuments()
  res.status(200).json({ videoList, getVideoCount })
}
// 获取视频详情以及发布者相关信息
exports.video = async (req, res) => {
  const { videoId } = req.params
  const videoInfo = await Video
                          .findById(videoId)
                          .populate('user', '_id username image')
                          await hotInc(videoId, 1)
  videoInfo = videoInfo.toJSON()
  videoInfo.islike = false
  videoInfo.isdislike = false
  videoInfo.isSubscribe = false
  if (req.user.userInfo) {
    const userId = req.user.userInfo._id
    if (await Videolike.findOne({ user: userId, video: videoId, like: 1 })) {
      videoInfo.islike = true
    }
    if (await Videolike.findOne({ user: userId, video: videoId, like: -1 })) {
      videoInfo.isdislike = true
    }
    if (await Subscribe.findOne({ user: userId, channel: videoId.user._id })) {
      videoInfo.isSubscribe = true
    }
  }
  await hotInc(videoId, 1)
  res.status(200).json(videoInfo)
}

exports.delete = async (req, res) => {
  console.log(req.method)
  res.send('video-list')
}

exports.createvideo = async (req, res) => {
  const id = req.user.userInfo._id
  req.body.user = id
  const videoModel = new Video(req.body)
  try {
    const dbBack =  await videoModel.save()
    res.status(201).json({ dbBack })
  } catch (error) {
    res.status(500).json({ error })
  }
}