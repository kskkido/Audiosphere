const app = require('APP'), {env} = app
const debug = require('debug')(`${app.name}:auth`)
const passport = require('passport')

const db = require('APP/db')
const OAuth = db.model('oauths'),
  User = db.model('users')
const auth = require('express').Router()

/*************************
 * Auth strategies
 *
 * The OAuth model knows how to configure Passport middleware.
 * To enable an auth strategy, ensure that the appropriate
 * environment variables are set.
 *
 * You can do it on the command line:
 *
 *   FACEBOOK_CLIENT_ID=abcd FACEBOOK_CLIENT_SECRET=1234 npm run dev
 *
 * Or, better, you can create a ~/.$your_app_name.env.json file in
 * your home directory, and set them in there:
 *
 * {
 *   FACEBOOK_CLIENT_ID: 'abcd',
 *   FACEBOOK_CLIENT_SECRET: '1234',
 * }
 *
 * Concentrating your secrets this way will make it less likely that you
 * accidentally push them to Github, for example.
 *
 * When you deploy to production, you'll need to set up these environment
 * variables with your hosting provider.
 **/

// Facebook needs the FACEBOOK_CLIENT_ID and FACEBOOK_CLIENT_SECRET
// environment variables.
OAuth.setupStrategy({
  provider: 'facebook',
  strategy: require('passport-facebook').Strategy,
  config: {
    clientID: env.FACEBOOK_CLIENT_ID,
    clientSecret: env.FACEBOOK_CLIENT_SECRET,
    callbackURL: `${app.baseUrl}/api/auth/login/facebook`,
  },
  passport
})

// Google needs the GOOGLE_CLIENT_SECRET AND GOOGLE_CLIENT_ID
// environment variables.
OAuth.setupStrategy({
  provider: 'google',
  strategy: require('passport-google-oauth').OAuth2Strategy,
  config: {
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${app.baseUrl}/api/auth/login/google`,
  },
  passport
})

// Github needs the GITHUB_CLIENT_ID AND GITHUB_CLIENT_SECRET
// environment variables.
OAuth.setupStrategy({
  provider: 'github',
  strategy: require('passport-github2').Strategy,
  config: {
    clientID: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    callbackURL: `${app.baseUrl}/api/auth/login/github`,
  },
  passport
})

OAuth.setupStrategy({
  provider: 'spotify',
  strategy: require('passport-spotify').Strategy,
  config: {
    clientID: 'acd4cd127b1d499686949a35f02e3b1a',
    clientSecret: '93d3eec86a2d454584dcdc0042b17878',
    callbackURL: `${app.baseUrl}/api/auth/login/spotify`,
  },
  passport
})

// passport.use(require('passport-spotify').Strategy,
//   // Spotify will send back the token and profile
//   function(token, refreshToken, profile, done) {
//     // the callback will pass back user profile information and each service (Facebook, Twitter, and Spotify) will pass it back a different way. Passport standardizes the information that comes back in its profile object.
//     console.log('---', 'in verification callback', profile, '---')
//     User.findOrCreate({
//       where: {
//         spotifyId: profile.id
//       },
//       defaults: {
//         name: profile.displayName,
//         email: profile.emails[0].value,
//       }
//     })
//     .spread(user => {
//       done(null, user)
//     })
//     .catch(done)
//   })

// Other passport configuration:
// Passport review in the Week 6 Concept Review:
// https://docs.google.com/document/d/1MHS7DzzXKZvR6MkL8VWdCxohFJHGgdms71XNLIET52Q/edit?usp=sharing
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(
  (id, done) => {
    debug('will deserialize user.id=%d', id)
    User.findById(id)
      .then(user => {
        if (!user) debug('deserialize retrieved null user for id=%d', id)
        else debug('deserialize did ok user.id=%d', id)
        done(null, user)
      })
      .catch(err => {
        debug('deserialize did fail err=%s', err)
        done(err)
      })
  }
)

// require.('passport-local').Strategy => a function we can use as a constructor, that takes in a callback
passport.use(new (require('passport-local').Strategy)(
  (email, password, done) => {
    debug('will authenticate user(email: "%s")', email)
    User.findOne({
      where: {email},
      attributes: {include: ['password_digest']}
    })
      .then(user => {
        if (!user) {
          debug('authenticate user(email: "%s") did fail: no such user', email)
          return done(null, false, { message: 'Login incorrect' })
        }
        return user.authenticate(password)
          .then(ok => {
            if (!ok) {
              debug('authenticate user(email: "%s") did fail: bad password')
              return done(null, false, { message: 'Login incorrect' })
            }
            debug('authenticate user(email: "%s") did ok: user.id=%d', email, user.id)
            done(null, user)
          })
      })
      .catch(done)
  }
))

auth.get('/whoami', (req, res) => res.send(req.user))

// POST requests for local login:
auth.post('/login/local', passport.authenticate('local', {successRedirect: '/'}))

// GET requests for OAuth login:
// Register this route as a callback URL with OAuth provider
auth.get('/login/:strategy', (req, res, next) => {
  return passport.authenticate(req.params.strategy, {
    scope: 'playlist-read-private streaming user-read-email', // You may want to ask for additional OAuth scopes. These are
    successRedirect: '/api/users/playlist' // provider specific, and let you access additional data (like
                    // their friends or email), or perform actions on their behalf.
    // Specify other config here
  })(req, res, next)
})

// Google authentication and login
// app.get('/auth/google', passport.authenticate('google', { scope: 'email' }));
//

auth.post('/logout', (req, res) => {
  req.logout()
  res.redirect('/api/auth/whoami')
})

module.exports = auth
