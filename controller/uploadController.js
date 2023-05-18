let STS = require('qcloud-cos-sts');
// 配置参数
const {
  uploadConfig
} = require('../config/config.default')
const {
  HttpModel
} = require('../model/httpModel')
const httpModel = new HttpModel()

var shortBucketName = uploadConfig.bucket.slice(0, uploadConfig.bucket.lastIndexOf('-'));
var appId = uploadConfig.bucket.slice(1 + uploadConfig.bucket.lastIndexOf('-'));

var policy = {
  'version': '2.0',
  'statement': [{
    'action': [
      // 简单上传
      'name/cos:PutObject',
      'name/cos:PostObject',
      // 分片上传
      'name/cos:InitiateMultipartUpload',
      'name/cos:ListMultipartUploads',
      'name/cos:ListParts',
      'name/cos:UploadPart',
      'name/cos:CompleteMultipartUpload',
    ],
    'effect': 'allow',
    'principal': {
      'qcs': ['*']
    },
    'resource': [
      'qcs::cos:' + uploadConfig.region + ':uid/' + appId + ':prefix//' + appId + '/' + shortBucketName + '/' + uploadConfig.allowPrefix,
    ],
  }],
};
exports.getSignature = async (req, res) => {
  try {
    STS.getCredential({
      secretId: uploadConfig.secretId,
      secretKey: uploadConfig.secretKey,
      proxy: uploadConfig.proxy,
      durationSeconds: uploadConfig.durationSeconds,
      region: uploadConfig.region,
      endpoint: uploadConfig.endpoint,
      policy: policy,
    }, function (err, tempKeys) {
      var result = err || tempKeys || '';
      return res.send(httpModel.success(result))
    })
  } catch (error) {
    res.status(500).json({
      error
    })
  }
}