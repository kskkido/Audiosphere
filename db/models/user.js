'use strict'

// bcrypt docs: https://www.npmjs.com/package/bcrypt
const bcrypt = require('bcryptjs')
    , {ARRAY, INTEGER, STRING, VIRTUAL} = require('sequelize')

module.exports = db => db.define('users', {
  accessToken: STRING(500),
  provider: STRING(500),
  uid: STRING(500),
  username: STRING(500),
  displayName: STRING(500),
  profileUrl: STRING(500),
  apiUrl: STRING(500),
  photo: STRING(500),
  country: STRING(500),
  followers: STRING(500),
  email: STRING(500)
})

module.exports.associations = (User, {OAuth}) => {
  User.hasOne(OAuth)
}
