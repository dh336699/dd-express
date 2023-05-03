const { redis } = require('./index')

exports.hotInc = async (videoId, incNum) => {
  const data = await redis.zscore('hotInc', videoId)
  let inc = null
  if (!data) {
    inc = redis.zadd('hotInc', incNum, videoId)
  } else [
    inc = await redis.zincrby('hotInc', incNum, videoId)
  ]
  console.log(await redis.zscore('hotInc', videoId));
  return inc
}

exports.topHosts = async (num = 3) => {
  const list = await redis.zrevrange('hotInc', 0, 1, 'withscores')
  console.log(list);
  const newarr = list.slice(0, num * 2)
  const obj = {}
  for (let i = 0; i < newarr.length; i++) {
    if (i % 2 == 0) {
      obj[newarr[i]] = newarr[i + 1]
    }
  }
  return obj
}