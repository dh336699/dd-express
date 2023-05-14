// const {
//   isEmpty
// } = require('lodash')
const {
  Table
} = require('../model')
const {
  HttpModel
} = require('../model/httpModel')
const {
  wxHttp
} = require("../util/http")
const path = require('path');
const fs = require('fs');
let { access_token, appid, secret, qrPath } = require('../config/config.default')

const httpModel = new HttpModel()

exports.getTableList = async (req, res) => {
  try {
    let data = await Table.find().sort({
      tableNo: 1
    }).populate({
      path: 'orderList',
      populate: [{
          path: 'user'
        },
        {
          path: 'menu',
          populate: ['goods']
        },
      ]
    })
    res.send(httpModel.success(data))
  } catch (error) {
    res.status(500).send(httpModel.error())
  }
}

exports.createTable = async (req, res) => {
  try {
    const {
      tableNo
    } = req.body
    const dbBack = await Table.findOne({
      tableNo,
    })
    if (dbBack && dbBack.tableNo) {
      res.status(200).send(httpModel.error('当前桌子已存在'))
      return
    } else {
      const data = new Table({
        tableNo
      })
      await data.save()
      res.send(httpModel.success())
    }
  } catch (error) {
    res.status(500).send(httpModel.error())
  }
}

exports.updateTable = async (req, res) => {
  try {
    const {
      _id,
      tableNo,
      status,
    } = req.body
    await Table.findByIdAndUpdate(_id, {
      tableNo,
      status,
    }, {
      new: true
    })

    res.send(httpModel.success())
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}

exports.updateTableStatus = async (req, res) => {
  try {
    const {
      tableNo,
      status,
      orderList
    } = req.body
    await Table.updateOne({
      tableNo
    }, {
      $set: {
        status,
        orderList
      }
    }, {
      new: true
    })
    res.send(httpModel.success())
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}

exports.createTableQr = async (req, res) => {
  try {
    const { tableNo } = req.query

  if (!access_token) {
    const {data} = await wxHttp.get({url: '/cgi-bin/token', params: { grant_type: 'client_credential', appid, secret }})
    access_token = data.access_token
  }
    const qrcode = await wxHttp.post({url: `/cgi-bin/wxaapp/createwxaqrcode?access_token=${access_token}`,
    params: { path: qrPath, scene: { tableNo } }, responseType: 'stream' })
    qrcode.pipe(fs.createWriteStream('qrcode.png'))
  } catch (error) {
    res.status(500).send(httpModel.error())
  }
}

exports.deleteTable = async (req, res) => {
  try {
    const id = req.params.id
    const data = await Table.findById(id)
    await data.remove()
    res.send(httpModel.success())
  } catch (err) {
    res.status(500).send(httpModel.error())
  }
}

exports.getWxInfo = async (req, res) => {
  try {
    res.status(200).send(httpModel.success({ appid, secret }))
  } catch (error) {
    res.status(500).send(httpModel.error())
  }
}