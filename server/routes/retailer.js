const express = require('express');
const router = express.Router();

// retailers model
const retailers = require('../models/retailer');

// get all retailers
router.get('/retailers', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send({ message: 'User is not authenticated' });
  retailers.find({}, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(data);
  });
});

// get one retailer
router.get('/retailers/:id', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send({ message: 'User is not authenticated' });
  retailers.findById(req.params.id, (err, data) => {
    const notFound = {
      message: 'Retailer not in system'
    };
    if (err) return res.status(500).send(err);
    if (!data) return res.status(200).send(notFound);
    return res.status(200).send(data);
  });
});

// create new retailer
router.post('/retailers', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send({ message: 'User is not authenticated' });
  retailers.find({
    retailer: req.body.retailer
  }, (findErr, findData) => {
    if (findErr) return res.status(500).send(findErr);
    if (findData.length > 0) return res.status(200).send({ retailer: 'Retailer already exists' });

    retailers.create(req.body, (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(data);
    });
  });
});

// delete retailer
router.delete('/retailers/:id', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send({ message: 'User is not authenticated' });
  retailers.findByIdAndRemove(req.params.id, (err, data) => {
    const deleted = {
      message: 'Retailer deleted'
    };
    if (err) return res.status(500).send(err);
    res.status(200).send(deleted);
  });
});

// update retailer
router.put('/retailers/:id', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send({ message: 'User is not authenticated' });
  retailers.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  }, (err, data) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(data);
  });
});

module.exports = router;
