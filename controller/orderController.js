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
const io = require('../websocket');

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
      menu
    } = req.body

    const menuWithPrice = await Promise.all(menu.map(async item => {
      const {
        minPrice
      } = await Goods.findById(item.goods)

      return {
        ...item,
        price: minPrice
      }
    }))

    const total = menuWithPrice.reduce((acc = 0, item) => {
      return acc + item.price * item.number
    }, 0)

    const data = await new ShopCar({
      ...req.body,
      menu: menuWithPrice,
      total,
      user: [userInfo._id]
    })
    await data.save()
    io.emit('update')
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
      menu,
      tableNo,
      total
    } = req.body;
    if (!menu) {
      const dbBack = await ShopCar.findOne({
        tableNo,
      })
      await dbBack.remove()
      io.emit('update')
      return res.send(httpModel.success())
    }
    await ShopCar.updateMany({
      tableNo,
    }, {
      $set: {
        menu,
        user: dbBack.user.includes(userInfo._id) ? dbBack.user : dbBack.user.concat(userInfo._id),
        total
      }
    })
    io.emit('update')
    res.send(httpModel.success())
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}
exports.deleteShopCar = async (req, res) => {
  try {
    const {
      tableNo
    } = req.params
    const dbBack = await ShopCar.deleteOne({
      tableNo,
    })
    io.emit('update')
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
      total,
      type,
      tableNo,
      orderPerson
    } = req.body

    // 查询每一条商品的单价
    const menuWithPrice = await Promise.all(menu.map(async (item) => {
      const {
        minPrice
      } = await Goods.findById(item.goods);
      return {
        ...item,
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
      total: totalPrice,
      type,
      tableNo,
      orderPerson
    })
    await newOrder.save()

    const dbBack = await ShopCar.deleteMany({
      tableNo,
    })
    io.emit('update')

    res.send(httpModel.success())
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}

exports.getOrder = async (req, res) => {
  try {
    const {
      type
    } = req.query

    let startOfDay
    const endOfDay = dayjs().endOf('day')
    if (type === 'day') {
      startOfDay = dayjs().startOf('day');
    } else if (type === 'month') {
      startOfDay = dayjs().subtract(1, 'months').startOf('day');
    } else if (type === 'year') {
      startOfDay = dayjs().subtract(12, 'months').startOf('day');
    }

    let orders = await Order.find({
      createAt: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    }).populate(['user', 'menu.goods']);
    console.log(orders);
    res.send(httpModel.success(orders))
  } catch (error) {
    res.status(500).send(httpModel.error())
  }
}

exports.getMyOrders = async (req, res) => {
  try {
    const {
      userInfo
    } = req;
    const orders = await Order.find({
      user: userInfo._id
    }).populate(['menu.goods', 'user'])
    res.send(httpModel.success(orders))
  } catch (error) {
    res.status(500).send(httpModel.error())
  }
}