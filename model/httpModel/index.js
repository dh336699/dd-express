class HttpModel {
  constructor () {}
  
  success(result = {}) {
    return {
      code: 200,
      result,
      msg: 'ok'
    }
  }

  error(err) {
    return {
      code: 500,
      data: {},
      err,
      msg: '请求失败，请稍后再试'
    }
  }
}
exports.HttpModel = HttpModel