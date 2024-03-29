const fs = require('fs')
const {
  promisify
} = require('util')
const {
  omit,
  includes,
} = require("lodash")
const md5 = require('../util/md5')
const {
  User,
  Address
} = require('../model')
const {
  createToken
} = require('../util/jwt')
const {
  wxHttp
} = require("../util/http")
const {
  HttpModel
} = require('../model/httpModel')
const {
  adminList,
  managerList
} = require('../config/config.default.js')
const {
  appid,
  secret
} = require('../config/config.default')
const httpModel = new HttpModel()
const rename = promisify(fs.rename)

exports.wxLogin = async (req, res) => {
  try {
    const {
      code
    } = req.body;

    const {
      data
    } = await wxHttp.get({
      url: '/sns/jscode2session',
      params: {
        appid,
        secret,
        js_code: code,
        grant_type: 'authorization_code'
      }
    })

    let userInfo = await User.findOne({
      openId: data.openid
    })
    let isAdmin, isManager
    if (includes(adminList, data.openid)) {
      isAdmin = true
    }
    if (includes(managerList, data.openid)) {
      isManager = true
    }
    if (!userInfo) {
      const userModel = new User({
        openId: data.openid,
        isAdmin,
        isManager
      })
      userInfo = await userModel.save()
    } else {
      if (userInfo.userName === 'super_admin336699') {
        isAdmin = true
      }
      if (userInfo.userName === 'super_manager336699') {
        isManager = true
      }
      await User.updateOne({
        openId: data.openid
      }, {
        $set: {
          isAdmin,
          isManager
        }
      })
    }
    const token = await createToken(userInfo)
    res.send(httpModel.success(token))
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}

exports.loginH5 = async (req, res) => {
  try {
    const {
      phone,
      password
    } = req.body;
    let userInfo = await User.findOne({
      phone
    }).select('+password')
    if (!userInfo) {
      const userModel = new User({
        openId: phone,
        phone,
        password
      })
      userInfo = await userModel.save()
      const token = await createToken(userInfo)
      res.send(httpModel.success({
        ...omit(userInfo.toJSON(), 'password'),
        token
      }))
    } else {
      if (userInfo.password === md5(password) || userInfo.password === password) {
        const token = await createToken(userInfo)
        res.send(httpModel.success({
          ...omit(userInfo.toJSON(), 'password'),
          token
        }))
      } else {
        res.status(500).send('账户或密码不正确')
      }
    }
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}

exports.updateUserInfo = async (req, res) => {
  try {
    userInfo = {
      ...req.userInfo,
      ...req.body
    }
    const id = userInfo._id
    const data = await User.findByIdAndUpdate(id, userInfo, {
      new: true
    })
    res.send(httpModel.success(data))
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}

exports.uploadAvatar = async (req, res) => {
  try {
    res.send(httpModel.success({
      filepath: req.file.filename,
      type: 'avatar'
    }))
  } catch (error) {
    res.status(500).json({
      error
    })
  }
}

exports.deleteAvatar = async (req, res) => {
  const {
    fileName
  } = req.params
  let filePath
  if (req.headers.env === 'dev') {
    filePath = 'public/dev/avatar/' + fileName
  } else {
    filePath = 'public/prod/avatar/' + fileName
  }


  fs.unlink(filePath, (err) => {
    if (err) {
      res.status(500).json({
        error: '删除文件时出错了。'
      })
    }
    return res.send(httpModel.success())
  })
}

exports.getMemberInfo = async (req, res) => {
  try {
    const {
      phone
    } = req.params
    const oldInfo = await User.findOne({
      phone
    })
    res.send(httpModel.success(oldInfo))
  } catch (error) {
    res.status(500).send(httpModel.error())
  }
}

exports.updateMemberInfo = async (req, res) => {
  try {
    let {
      oldUserInfo,
      newUserInfo
    } = req.body

    // 传入新头像时，并且旧头像有值时 才会去删除旧头像
    if (oldUserInfo.avatar && newUserInfo.avatar) {
      fileName = oldUserInfo.avatar.slice(oldUserInfo.avatar.indexOf('avatar/') + 7);
      let filePath
      if (req.headers.env === 'dev') {
        filePath = 'public/dev/avatar/' + fileName
      } else {
        filePath = 'public/prod/avatar/' + fileName
      }

      fs.unlink(filePath, (err) => {
        if (err) {}
      })
    }
    const keysToUpdate = Object.keys(newUserInfo); // 获取newUserInfo中所有字段的键

    // 遍历键数组，检查字段值是否为空，并将空值字段从newUserInfo中删除
    keysToUpdate.forEach(key => {
      if (newUserInfo[key] === '') {
        delete newUserInfo[key]; // 从newUserInfo对象中删除空值字段
      }
    });

    const data = await User.findOneAndUpdate({
      phone: oldUserInfo.phone
    }, newUserInfo, {
      new: true
    })
    res.send(httpModel.success(data))
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}

exports.getAddress = async (req, res) => {
  try {
    let {
      userInfo
    } = req
    const addressList = await Address.find({
      userId: userInfo._id
    })
    res.send(httpModel.success(addressList))
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}

exports.addAddress = async (req, res) => {
  try {
    let {
      userInfo
    } = req
    const data = {
      userId: userInfo._id,
      ...omit(req.body, 'userInfo')
    }
    const addressModel = await new Address(data)
    await addressModel.save()
    res.send(httpModel.success())
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}

exports.updateAddress = async (req, res) => {
  try {
    const id = req.body._id
    await Address.updateMany({
      default: true
    }, {
      $set: {
        default: false
      }
    })
    await Address.findByIdAndUpdate(id, req.body, {
      new: true
    })

    res.send(httpModel.success())
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}

exports.deleteAddress = async (req, res) => {
  try {
    const id = req.params.id
    const data = await Address.findById(id)
    await data.remove()
    res.send(httpModel.success())
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}

exports.getApplyList = async (req, res) => {
  try {
    const {
      userInfo
    } = req
    const {
      type,
      limit,
      page
    } = req.query
    if (userInfo.isAdmin || userInfo.isManager) {
      if (type === 'apply') {
        let dbBack = await User.find({
          orderAuth: 'apply'
        })
        res.send(httpModel.success(dbBack))
      } else {
        let dbBack = await User.aggregate([{
          $match: {
            orderAuth: {
              $in: ['agree', 'reject']
            }
          }
        }]).skip(Number(limit) * (Number(page) - 1)).limit(Number(limit))
        res.send(httpModel.success(dbBack))
      }
    } else {
      return res.status(500).send(httpModel.error('您无权限'))
    }
  } catch (error) {
    res.status(500).send(httpModel.error())
  }
}

exports.getUserInfo = async (req, res) => {
  let {
    userInfo
  } = req
  const user = await User.findById(userInfo._id)
  const token = await createToken(user)
  Reflect.deleteProperty(user, 'openId')
  Reflect.deleteProperty(user, 'password')
  res.send(httpModel.success({
    ...user.toJSON(),
    token
  }))
}

// // 获取本人的粉丝列表
// exports.getchannel = async (req, res) => {
//   const { pageNumber, pageSize } = req.body
//   let channelList = await Subscribe.find({
//     channel: req.user.userInfo._id
//   }).skip((pageNumber - 1) * pageSize)
//     .limit(pageSize)
//     .populate('user')
//   channelList = channelList.map(item => {
//     return lodash.pick(item.user, ['_id', 'username', 'image', 'subscribeCount', 'cover', 'channeldes'])
//   })
//   res.status(200).json(channelList)
// }
// // 获取关注的人的粉丝列表
// exports.getsubscribe = async (req, res) => {
//   let subscribeList = await Subscribe.find({
//     user: req.params.userId
//   }).populate('channel')
//   subscribeList = subscribeList.map(item => {
//     return lodash.pick(item.channel, ['_id', 'username', 'image', 'subscribeCount', 'cover', 'channeldes'])
//   })
//   res.status(200).json(subscribeList)
// }

// exports.getuser = async (req, res) => {
//   let isSubscribe = false
//   if (req.user) {
//     const record = await Subscribe.findOne({ channel: req.params.userId, user: req.user.userInfo._id })
//     if (record) {
//       isSubscribe = true
//     }
//   }

//   const user = await User.findById(req.params.userId)
//   user.isSubscribe = isSubscribe
//   res.status(200).json({
//     ...lodash.pick(user, ['_id', 'username', 'image', 'subscribeCount', 'cover', 'channeldes']),
//     isSubscribe
//   })
// }

// exports.unsubscribe = async (req, res) => {
//   const userId = req.user.userInfo._id
//   const channelId = req.params.userId
//   if (userId === channelId) {
//     return res.status(401).json({ err: '不能取消关注自己' })
//   }

//   const record = await Subscribe.findOne({ user: userId, channel: channelId })
//   if (record) {
//     await record.remove()

//     const channelUser = await User.findById(channelId)
//     channelUser.subscribeCount--
//     await channelUser.save()
//     res.status(200).json({ msg: '取消关注成功' })
//   } else {
//     res.status(200).json({ msg: '还没进行关注' })
//   }
// }
// // 关注频道 订阅
// exports.subscribe = async (req, res) => {
//   const userId = req.user.userInfo._id
//   const channelId = req.params.userId
//   if (userId === channelId) {
//     return res.status(401).json({ err: '不能关注自己' })
//   }

//   const record = await Subscribe.findOne({ user: userId, channel:channelId })

//   if (record) {
//     return res.status(401).json({ err: '已经订阅了此频道' })
//   } else {
//     await new Subscribe({ user: userId, channel:channelId }).save()

//     const user = await User.findById(channelId)
//     user.subscribeCount++
//     await user.save()
//     res.status(200).json({ msg: '关注成功' })
//   }
// }
// // 用户注册
// exports.register = async (req, res) => {
//   const userModel = new User(req.body)
//   const dbBack = await userModel.save()
//   const user = dbBack.toJSON()
//   delete user.password
//   res.status(201).json(user)
// }
// // 用户登录
// exports.login = async (req, res) => {
//   // 客户端数据验证
//   // 连接数据库查询
//   let dbBack = await User.findOne(req.body)
//   if (!dbBack) {
//     res.status(402).json({ error: '邮箱或密码不正确' })
//   }
//   dbBack = dbBack.toJSON()
//   dbBack.token = await createToken(dbBack)
//   // dbBack.token = token
//   res.status(200).json(dbBack)
// }

// exports.update = async (req, res) => {
//   const id = req.user.userInfo._id
//   const dbData = await User.findByIdAndUpdate(id, req.body, { new: true })
//   res.status(202).json({ user: dbData })
// }

// 用户头像上传
exports.headimg = async (req, res) => {
  const fileArr = req.file.originalname.split('.')
  const fileType = fileArr[fileArr.length - 1]
  try {
    await rename('./public/' + req.file.filename,
      './public/' + req.file.filename + '.' + fileType)
    res.status(201).json({
      filepath: req.file.filename + '.' + fileType
    })
  } catch (error) {
    res.status(500).json({
      error
    })
  }
}