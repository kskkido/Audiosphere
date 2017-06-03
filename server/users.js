'use strict'

const db = require('APP/db')
const User = db.model('users')

const {mustBeLoggedIn, forbidden} = require('./auth.filters')

const router = require('express').Router()

router.route('/')
.get(forbidden('listing users is not allowed'),
  (req, res, next) =>
    User.findAll()
      .then(users => res.json(users))
      .catch(next))
.post((req, res, next) =>
    User.create(req.body)
    .then(user => res.status(201).json(user))
    .catch(next))

router.route('/playlist')
.get(mustBeLoggedIn,
  (req, res, next) => {
    console.log(req.user)
    if (!req.user) {
      return res.sendStatus(404)
    }
    res.redirect('/')
  })

module.exports = router
