const express = require('express');
const router = express.Router();
const passport = require('passport');

// admin user model
const admin = require('../models/admin');

// register new admin user
router.post('/register', (req, res) => {
  admin.register(new admin({
      username: req.body.username,
      permissions: req.body.permissions
    }),
    req.body.password,
    (err, user) => {
      if (err) return res.status(500).send(err);
      passport.authenticate('local')(req, res, () => {
        return res.status(200).send({ message: 'Registration successful!', permissions: user.permissions });
      });
    });
});

// login admin user
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(401).send(info);
    req.logIn(user, err => {
      if (err) return res.status(500).send(err);
      return res.status(200).send({ message: 'Login successful!', permissions: user.permissions });
    });
  })(req, res, next);
});

// logout admin user
router.get('/logout', (req, res) => {
  req.logout();
  return res.status(200).send({ message: 'Bye!' });
});

// get admin user status
router.get('/status', (req, res) => {
  let permissions;
  if (req.user) permissions = req.user.permissions;
  return res.status(200).send({
    auth: req.isAuthenticated(),
    permissions: permissions
  });
});

module.exports = router;
