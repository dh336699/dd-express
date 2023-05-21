const fs = require('fs')
const {
  promisify
} = require('util')
const rename = promisify(fs.rename)

const {
  Menu,
  Goods
} = require('../model')
const {
  HttpModel
} = require('../model/httpModel')
const httpModel = new HttpModel()

exports.getMenuList = async (req, res) => {
  try {
    let data = await Menu.find().populate({
      path: 'goodsList',
      match: { delete: false },
      model: 'Goods'
    }).sort({
      sort: 1
    })
    res.send(httpModel.success(data))
  } catch (error) {
    res.status(500).send(httpModel.error())
  }
}

exports.createMenu = async (req, res) => {
  try {
    const {
      menuName,
      sort
    } = req.body
    const dbBack = await Menu.findOne({
      menuName: req.body.menuName,
    })
    if (dbBack && dbBack.menuName) {
      res.status(200).send(httpModel.error('当前菜单已存在'))
      return
    } else {
      const data = new Menu({
        menuName,
        sort
      })
      await data.save()
      res.send(httpModel.success())
    }

  } catch (error) {
    res.status(500).send(httpModel.error())
  }
}

exports.updateMenu = async (req, res) => {
  try {
    const {
      _id,
      menuName,
      goodsList,
      sort
    } = req.body
    await Menu.findByIdAndUpdate(_id, {
      menuName,
      goodsList,
      sort
    }, {
      new: true
    })

    res.send(httpModel.success())
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}

exports.deleteMenu = async (req, res) => {
  try {
    const id = req.params.id
    const data = await Menu.findById(id)
    await data.remove()
    res.send(httpModel.success())
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}

exports.getGoodsList = async (req, res) => {
  try {
    const data = await Goods.find({ delete: false })
    res.send(httpModel.success(data))
  } catch (error) {
    res.status(500).send(httpModel.error())
  }
}

exports.createGoods = async (req, res) => {
  try {
    const dbBack = await Goods.findOne({
      name: req.body.name
    })
    if (dbBack && dbBack.name) {
      return res.status(200).send(httpModel.error('当前商品已存在'))
    } else {
      const data = new Goods(req.body)
      await data.save()
      res.send(httpModel.success())
    }

  } catch (error) {
    res.status(500).send(httpModel.error())
  }
}

exports.uploadImage = async (req, res) => {
  try {
    res.send(httpModel.success({
      filepath: req.file.filename
    }))
  } catch (error) {
    res.status(500).json({
      error
    })
  }
}

exports.deleteImage = async (req, res) => {
  const {
    fileName
  } = req.params
  const filePath = 'public/' + fileName

  fs.unlink(filePath, (err) => {
    if (err) {
      res.status(500).json({
        error: '删除文件时出错了。'
      })
    }
    return res.send(httpModel.success())
  })
}

exports.updateGoods = async (req, res) => {
  try {
    await Goods.findByIdAndUpdate(req.body._id, req.body, {
      new: true
    })
    res.send(httpModel.success())
  } catch (error) {
    res.status(500).send(httpModel.error())
  }
}
exports.deleteGoods = async (req, res) => {
  try {
    const id = req.params.id
    await Goods.updateOne({ _id: id }, { $set: { delete: true }})
    res.send(httpModel.success())
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}