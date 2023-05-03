const mongoose = require('mongoose')
const { mongopath } = require('../config/config.default')
async function main() {
  await mongoose.connect(mongopath)
}

main()
  .then(res => {
  console.log('mongo链接成功');
  })
  .catch(err => {
  console.log('mongo链接失败');
  })

module.exports = {
  User: mongoose.model('User', require('./userModel')),
  Address: mongoose.model('Address', require('./addressModel')),
  Menu: mongoose.model('Menu', require('./menuModel')),
  MenuGoods: mongoose.model('MenuGoods', require('./menuGoodsModel')),
  Goods: mongoose.model('Goods', require('./goodsModel')),
  // CollectModel: mongoose.model('CollectModel', require('./collectModel')),
}