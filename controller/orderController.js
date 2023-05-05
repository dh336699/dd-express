const {
  isEmpty
} = require('lodash')
const dayjs = require('dayjs')
const {
  ShopCar,
  Order,
  Goods
} = require('../model')
const {
  HttpModel
} = require('../model/httpModel')
const httpModel = new HttpModel()

exports.getShopCar = async (req, res) => {
  try {
    const {
      userInfo
    } = req
    const dbBack = await ShopCar.find({
      user: userInfo._id,
    })
    res.send(httpModel.success(dbBack))
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}

exports.createShopCar = async (req, res) => {
  try {
    const {
      userInfo
    } = req
    const {
      goods,
      number
    } = req.body;
    const dbBack = await ShopCar.findOne({
      user: userInfo._id,
      goods
    })
    if (!isEmpty(dbBack)) {
      let total = Number(dbBack.number) + Number(number)

      await ShopCar.updateMany({
        user: userInfo._id,
        goods
      }, {
        number: total
      })
    } else {
      const data = await new ShopCar({
        ...req.body,
        user: userInfo._id
      })
      await data.save()
    }
    res.send(httpModel.success())
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}
exports.updateShopCar = async (req, res) => {
  try {
    const {
      userInfo
    } = req
    const {
      goods,
      number
    } = req.body;
    const dbBack = await ShopCar.findOne({
      user: userInfo._id,
      goods
    })
    if (number === 0) {
      await dbBack.remove()
      return res.send(httpModel.success())
    }
    if (!isEmpty(dbBack)) {
      await ShopCar.updateMany({
        user: userInfo._id,
        goods
      }, {
        number: Number(number)
      })
    }
    res.send(httpModel.success())
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}
exports.deleteShopCar = async (req, res) => {
  try {
    const {
      userInfo
    } = req
    const dbBack = await ShopCar.deleteMany({
      user: userInfo._id,
    })
    res.send(httpModel.success(dbBack))
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}

exports.createOrder = async (req, res) => {
  try {
    const {
      userInfo
    } = req
    const {
      menu,
      total
    } = req.body
    // 查询每一条商品的单价

    const menuWithPrice = await Promise.all(menu.map(async (item) => {
      const {
        minPrice
      } = await Goods.findById(item.goods);
      return {
        goods: item.goods,
        number: item.number,
        price: minPrice
      }
    }))
    const totalPrice = menuWithPrice.reduce((acc = 0, item) => {
      return acc + item.price * item.number
    }, 0)

    // 与客户端提交的总价进行对比
    if (totalPrice !== total) {
      return res.status(400).send(httpModel.error())
    }

    const newOrder = await new Order({
      user: userInfo._id,
      menu: menuWithPrice,
      total: totalPrice
    })
    await newOrder.save()

    const dbBack = await ShopCar.deleteMany({
      user: userInfo._id,
    })

    res.send(httpModel.success())
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}

exports.getOrder = async (req, res) => {
  try {
    const date = dayjs().isSame(dayjs(), 'day')
    console.log(date);
    let orders = await Order.find().populate(['menu.goods', 'user'])
    orders = orders.map((order) => {
      if (dayjs().isSame(order.createAt, 'day')) {
        return order
      }
    })
    res.send(httpModel.success(orders))
  } catch (error) {
res.status(500).send(httpModel.error())
  }
}