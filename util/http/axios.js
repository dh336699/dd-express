const axios = require('axios');
const qs = require('qs');
const { cloneDeep } = require('lodash')
class VAxios {
   axiosInstance;
   options;

  constructor(options) {
    this.options = options;
    this.axiosInstance = axios.create(options);
  }

  /**
   * @description:  Create axios instance
   */
  createAxios(config) {
    this.axiosInstance = axios.create(config);
  }

  getTransform() {
    const { transform } = this.options;
    return transform;
  }

  getAxios() {
    return this.axiosInstance;
  }

  /**
   * @description: Reconfigure axios
   */
  configAxios(config) {
    if (!this.axiosInstance) {
      return;
    }
    this.createAxios(config);
  }

  /**
   * @description: Set general header
   */
  setHeader(headers) {
    if (!this.axiosInstance) {
      return;
    }
    Object.assign(this.axiosInstance.defaults.headers, headers);
  }


  get(config, options){
    return this.request({ ...config, method: 'GET' }, options);
  }

  post(config, options){
    return this.request({ ...config, method: 'POST' }, options);
  }

  put(config, options){
    return this.request({ ...config, method: 'PUT' }, options);
  }

  delete(config, options){
    return this.request({ ...config, method: 'DELETE' }, options);
  }

  request(config, options){
    let conf= cloneDeep(config);

    const { requestOptions } = this.options;

    const { beforeRequestHook } = this.getTransform();

    const opt = Object.assign({}, requestOptions, options);
    
    conf = beforeRequestHook(config, opt)

    conf.requestOptions = opt;

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request(conf)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}

module.exports = {
  VAxios
}