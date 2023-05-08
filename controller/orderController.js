const {
  isEmpty, includes
} = require('lodash')
const dayjs = require('dayjs')
const {
  ShopCar,
  Order,
  Goods,
  Table
} = require('../model')
const {
  HttpModel
} = require('../model/httpModel')
const io = require('../websocket');

const httpModel = new HttpModel()

exports.getShopCar = async (req, res) => {
  try {
    const {
      id
    } = req.params
    const dbBack = await ShopCar.findOne({
      tableNo: id,
    }).populate('menu.goods')
    res.send(httpModel.success(dbBack))
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}

// exports.createShopCar = async (req, res) => {
//   try {
//     const {
//       userInfo
//     } = req
//     const {
//       menu
//     } = req.body

//     const menuWithPrice = await Promise.all(menu.map(async item => {
//       const {
//         minPrice
//       } = await Goods.findById(item.goods)

//       return {
//         ...item,
//         price: minPrice
//       }
//     }))

//     const total = menuWithPrice.reduce((acc = 0, item) => {
//       return acc + item.price * item.number
//     }, 0)

//     const data = await new ShopCar({
//       ...req.body,
//       menu: menuWithPrice,
//       total,
//       user: [userInfo._id]
//     })
//     await data.save()
//     io.emit('update')
//     res.send(httpModel.success())
//   } catch (err) {
//     res.status(500).send(httpModel.error())
//   }
// }
exports.optShopCar = async (req, res) => {
  try {
    const {
      userInfo
    } = req
    const {
      goods,
      number,
      name,
      tableNo,
      type
    } = req.body;
    const dbBack = await ShopCar.findOne({
      tableNo,
    })
    const {
      minPrice
    } = await Goods.findById(goods)
    const menuGoods = {
      goods,
      number: Number(number),
      price: minPrice
    }
     // 新增购物车
    if (isEmpty(dbBack)) {
      const menu = [menuGoods]
      const data = await new ShopCar({
        user: userInfo._id,
        menu,
        total: minPrice * number,
        name,
        tableNo
      })
      const newOrder = await data.save()
      await Table.updateOne({ tableNo }, { $addToSet: { orderList: newOrder._id }})
      // io.emit('update')
      return res.send(httpModel.success())
    } else {
      // 更新购物车
    let isInclude = false
      for (let i = 0; i < dbBack.menu.length; i++) {
        const item = dbBack.menu[i]
        if (item.goods.equals(goods)) {
          if (type === 'stepper') {
            item.number = number
          } else {
            item.number += Number(number)
          }
          isInclude = true
        }
      }
      if (!isInclude) {
        dbBack.menu.push(menuGoods)
      }
      // 删除当前某个菜
      dbBack.menu = dbBack.menu.filter(item => item.number > 0)
      // 更新购物车
      if (!isEmpty(dbBack.menu)) {
        const total = dbBack.menu.reduce((acc = 0, item) => {
          return acc + item.price * item.number
        }, 0)
    
        await ShopCar.updateOne({
          tableNo,
        }, {
          $set: {
            menu: dbBack.menu,
            total
          },
          $addToSet: {
            user: userInfo._id
          }
        })
        io.emit('update')
      } else {
        //删除购物车
        await dbBack.remove()
        io.emit('update')
      }
      res.send(httpModel.success())
    }
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
      orderPerson,
      remark
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
    // 创建新订单时需要 清空购物车 更新餐桌信息
    const newOrder = await new Order({
      user: userInfo._id,
      menu: menuWithPrice,
      total: totalPrice,
      type,
      tableNo,
      orderPerson,
      remark
    })
    const dbBack = await newOrder.save()

    await Table.updateOne({ tableNo }, { $push: { orderList: newOrder._id }, $set: { status: 'serving' } })
    await ShopCar.deleteMany({
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