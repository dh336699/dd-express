class HttpModel {
  constructor () {}
  
  success(result = {}) {
    return {
      code: 200,
      result,
      msg: 'ok'
    }
  }

  error(msg) {
    return {
      code: 500,
      data: {},
      msg: msg || '请求失败，请稍后再试'
    }
  }
}
exports.HttpModel = HttpModel