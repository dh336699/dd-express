const dayjs = require('dayjs')

module.exports = {
  createAt: {
    type: Date,
    default: () => dayjs()
  },
  updateAt: {
    type: Date,
    ddefault: () => dayjs()
  }
}