'use strict'

// bcrypt docs: https://www.npmjs.com/package/bcrypt
const bcrypt = require('bcryptjs')
    , {ARRAY, INTEGER, STRING, VIRTUAL} = require('sequelize')

module.exports = db => db.define('users', {
  accessToken: STRING,
  provider: STRING,
  uid: STRING,
  username: STRING,
  displayName: STRING,
  profileUrl: STRING,
  apiUrl: STRING,
  photo: STRING,
  country: STRING,
  followers: STRING,
  email: STRING
})

module.exports.associations = (User, {OAuth, Thing, Favorite}) => {
  User.hasOne(OAuth)
  User.belongsToMany(Thing, {as: 'favorites', through: Favorite})
}
