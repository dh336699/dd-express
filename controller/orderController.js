const {
  isEmpty,
  isNumber
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
      type,
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
      if (isNumber(tableNo)) {
        await Table.updateOne({
          tableNo
        }, {
          $set: {
            status: 'ordering'
          }
        })
      }
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

        const back = await ShopCar.updateOne({
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

exports.updateShopCarTableNo = async (req, res) => {
  try {
    const {
      oldTableNo,
      newTableNo
    } = req.body;
    const dbBack = await ShopCar.findOne({
      tableNo: oldTableNo
    })
    const personal = await ShopCar.findOne({
      tableNo: newTableNo
    })
    if (isEmpty(dbBack)) {
      return res.status(500).send(httpModel.error())
    } else {
      if (!isEmpty(personal)) {
        await personal.remove()
      }
      await ShopCar.updateOne({
        tableNo: oldTableNo
      }, {
        $set: {
          tableNo: newTableNo
        }
      })

      await Table.updateOne({
        table: oldTableNo,
      }, {
        $set: {
          status: 'init'
        }
      })
    }
    res.send(httpModel.success())
  } catch (erro) {
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
      address,
      remark
    } = req.body

    // 查询每一条商品的单价
    const menuWithPrice = await Promise.all(menu.map(async (item) => {
      const {
        minPrice
      } = await Goods.findById(item.goods._id);
      return {
        goods: item.goods._id,
        number: Number(item.number),
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
    const dbBack = await new Order({
      user: userInfo._id,
      menu: menuWithPrice,
      total: totalPrice,
      type,
      tableNo,
      address,
      remark,
    })
    const newOrder = await dbBack.save()
    const tableBack = await Table.findOne({
      tableNo
    })

    if (!isEmpty(tableBack)) {
      await Table.updateOne({
        tableNo
      }, {
        $addToSet: {
          orderList: newOrder._id
        },
        $set: {
          status: 'serving'
        }
      })
    }
    if (tableNo) {
      await ShopCar.deleteOne({
        tableNo
      })
    } else {
      await ShopCar.deleteOne({
        tableNo: userInfo._id
      })
    }

    io.emit('update')

    res.send(httpModel.success())
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}

exports.updateOrder = async (req, res) => {
  try {
    const {
      id,
      status
    } = req.body

    await Order.updateOne({
      _id: id
    }, {
      $set: {
        status
      }
    })
    res.send(httpModel.success())
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}

exports.getOrder = async (req, res) => {
  try {
    const {
      type,
      limit,
      page,
      orderType
    } = req.query
    let startOfDay
    const endOfDay = dayjs().endOf('day')
    if (type === 'day') {
      startOfDay = dayjs().startOf('day');
    } else if (type === 'month') {
      startOfDay = dayjs().subtract(1, 'months').startOf('day');
    } else if (type === 'quarter') {
      startOfDay = dayjs().subtract(3, 'months').startOf('day');
    }

    let query = {
      createAt: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    };
    
    if (orderType !== "all") {
      query.type = orderType;
    }

    let orders = await Order.find(query).populate(['user', 'menu.goods', 'address']).sort({
      createAt: -1
    }).skip(Number(limit) * (Number(page) - 1)).limit(Number(limit))
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
    const { limit, page } = req.query
    const orders = await Order.find({
      user: userInfo._id
    }).populate(['menu.goods', 'address']).sort({
      createAt: -1
    }).skip(Number(limit) * (Number(page) - 1)).limit(Number(limit))
    res.send(httpModel.success(orders))
  } catch (error) {
    res.status(500).send(httpModel.error())
  }
}

exports.getAllOrderMoney = async (req, res) => {
  const { type, orderType } = req.query
  let startOfDay
  const endOfDay = dayjs().endOf('day').toDate()
  if (type === 'day') {
    startOfDay = dayjs().startOf('day').toDate();
  } else if (type === 'month') {
    startOfDay = dayjs().subtract(1, 'months').startOf('day').toDate();
  } else if (type === 'quarter') {
    startOfDay = dayjs().subtract(3, 'months').startOf('day').toDate();
  }

  let query = {
    createAt: {
      $gte: startOfDay,
      $lt: endOfDay
    },
    status: 'confirm'
  };
  if (orderType !== "all") {
    query.type = orderType;
  }
  try {
    const data = await Order.aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: '$type',
          totalMoney: { $sum: '$total' }
        }
      },
      {
        $project: {
          _id: 0,
          type: "$_id",
          totalMoney: 1
        }
      }
    ])
    res.send(httpModel.success(data))
  } catch (error) {
    res.status(500).send(httpModel.error())
  }
}