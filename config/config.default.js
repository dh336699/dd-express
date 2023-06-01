/**
 * 默认配置
 */

module.exports.uuid = 'a57a8788-d874-43cb-ae9a-6b7f05897b25'

module.exports.mongopath = 'mongodb://localhost:27017/dd-order'

module.exports.redisClient = {
  path: '127.0.0.1',
  port: 6379,
  options: {
    password: 'root'
  }
}

module.exports.adminList = ['oQ2j10BWjpcRICmxMfdXdDJFKg4Y']

module.exports.managerList = []

module.exports.access_token = ''

module.exports.appid = 'wx3b501070e74761c3'

module.exports.secret = '3f9a7309eb9cbe421c9089e68ea34839'

module.exports.qrPath = '/pages/index/index'

const SecretId = ''

const SecretKey = ''

module.exports.uploadConfig = {
  secretId: '', // 固定密钥
  secretKey: '', // 固定密钥
  proxy: '',
  host: 'sts.tencentcloudapi.com', // 域名，非必须，默认为 sts.tencentcloudapi.com
  // endpoint: 'sts.internal.tencentcloudapi.com', // 域名，非必须，与host二选一，默认为 sts.tencentcloudapi.com
  durationSeconds: 1800, // 密钥有效期
  // 放行判断相关参数
  bucket: 'scofield-1256958337', // 换成你的 bucket
  region: 'ap-shanghai', // 换成 bucket 所在地区
  allowPrefix: 'image/*' // 这里改成允许的路径前缀，可以根据自己网站的用户登录态判断允许上传的具体路径，例子： a.jpg 或者 a/* 或者 * (使用通配符*存在重大安全风险, 请谨慎评估使用)
};

module.exports.SecretId = SecretId

module.exports.SecretKey = SecretKey