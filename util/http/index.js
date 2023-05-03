const { VAxios } = require('./axios')
const { isString } = require('lodash') 
const globSetting = {
  apiUrl: ''
}

/**
 * @description: 数据处理，方便区分多种处理方式
 */
 const transform = {

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl } = options;

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    return config;
  },
  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    return config;
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res) => {
    return res;
  },
};

function createAxios(opt) {
  return new VAxios(
    // 深度合并
    Object.assign({}, {
      // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
      // authentication schemes，e.g: Bearer
      // authenticationScheme: 'Bearer',
      timeout: 10 * 1000,
      // 基础接口地址
      // baseURL: globSetting.apiUrl,

      headers: { 'Content-Type': 'application/json' },
      
      transform,
      // 配置项，下面的选项都可以在独立的接口请求中覆盖
      requestOptions: {
        // 接口地址
        apiUrl: globSetting.apiUrl,
      },
    },
    opt || {},)
  );
}
const wxHttp = createAxios({ requestOptions: { apiUrl: 'https://api.weixin.qq.com' }});

module.exports = {
  wxHttp
}
