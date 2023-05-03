const { Menu, MenuGoods, Goods } = require('../model')
const { HttpModel } = require('../model/httpModel')
const httpModel = new HttpModel()

exports.getMenuList = async (req, res) => {
  try {
    const data = await Menu.find()
    res.send(httpModel.success(data))
  } catch (error) {
    res.status(500).send(httpModel.error())
  }
}

exports.createMenu = async (req, res) => {
  try {
    const { menuName } = req.body
    const dbBack = await Menu.findOne({ menuName: req.body.menuName })
    if (dbBack && dbBack.menuName) {
      res.status(200).send(httpModel.error('当前菜单已存在'))
      return
    } else {
      const data = new Menu({ menuName })
      await data.save()
      res.send(httpModel.success())
    }
    
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
    const dbBack = await Goods.findOne({ name: req.body.name })
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
    await Goods.findByIdAndUpdate(req.body._id, req.body, { new: true })
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
exports.optMenuGoods = async (req, res) => {
  try {
    const { menuName, menuId, goodsIdList } = req.body
    const dbBack = await Menu.findOne({ menuName })
    if (!dbBack) {
      res.status(500).send(httpModel.error('当前菜单已被删除'))
    }
    const menuGoods = await MenuGoods.find({ menuId })
    if (menuGoods) {
      await menuGoods.remove()
    } else {
      goodsIdList.forEach(async (item) => {
        const bk = await new MenuGoods({ menuName, menuId, goodsId: item })
        await bk.save()
      })
    }
    res.send(httpModel.success())
  } catch(error) {
    res.status(500).send(httpModel.error())
  }

}