const {
  isEmpty
} = require('lodash')
const {
  Menu,
  MenuGoods,
  Goods
} = require('../model')
const {
  HttpModel
} = require('../model/httpModel')
const httpModel = new HttpModel()

exports.getMenuList = async (req, res) => {
  try {
    let data = await Menu.find().populate('goodsList').sort({
      sort: 1
    })
    console.log(data);
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


exports.getMenuGoods = async (req, res) => {
  try {
    const id = req.params.id
    const data = await MenuGoods.find({
      menu: id
    }).populate('goods')
    res.send(httpModel.success(data))
  } catch (error) {
    res.status(500).send(httpModel.error())
  }
}


exports.createMenuGoods = async (req, res) => {
  try {
    const {
      menuName,
      menuId,
      goodsIdList
    } = req.body
    const dbBack = await Menu.findOne({
      menuName
    })
    if (isEmpty(dbBack)) {
      console.log(dbBack);
      return res.status(500).send(httpModel.error('当前菜单已被删除'))
    }
    const menuGoods = await MenuGoods.find({
      menuId
    })
    if (!isEmpty(menuGoods)) {
      menuGoods.forEach(async item => await item.remove())
    }

    goodsIdList.forEach(async (item) => {
      const bk = await new MenuGoods({
        menuName,
        menuId,
        goods: item
      })
      await bk.save()
    })
    res.send(httpModel.success())
  } catch (error) {
    res.status(500).send(httpModel.error())
  }
}

exports.getGoodsList = async (req, res) => {
  try {
    const data = await Goods.find()
    res.send(httpModel.success(data))
  } catch (error) {
    res.status(500).send(httpModel.error())
  }
}

exports.createGoods = async (req, res) => {
  try {
    console.log(req.body);
    const dbBack = await Goods.findOne({
      name: req.body.name
    })
    console.log(dbBack);
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

exports.updateGoods = async (req, res) => {
  try {
    console.log(req.body);
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
    const data = await Goods.findById(id)
    await data.remove()
    res.send(httpModel.success())
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}