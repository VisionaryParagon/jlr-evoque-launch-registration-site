const express = require('express');
const router = express.Router();

// models
const registrant = require('../models/registrant');
const employee = require('../models/employee');
const retailer = require('../models/retailer');

// login registrant
router.post('/registrants/login', (req, res) => {
  registrant.findOne({
    jlr_id: req.body.jlr_id
  }, (regErr, regData) => {
    const info = {
      message: 'Registrant data not found',
      registrant: {},
      employee: {},
      retailer: {}
    };
    if (regErr) return res.status(500).send(regErr);
    if (!regData) {
      employee.findOne({
        jlr_id: req.body.jlr_id
      }, (empErr, empData) => {
        info.message = 'Employee data not found';

        if (empErr) return res.status(500).send(empErr);
        if (!empData) return res.status(200).send(info);

        retailer.findOne({
          retailer: empData.retailer
        }, (retErr, retData) => {
          info.message = 'Retailer data not found';
          info.employee = empData;

          if (retErr) return res.status(500).send(retErr);
          if (!retData) return res.status(200).send(info);

          info.message = 'Success';
          info.retailer = retData;
          return res.status(200).send(info);
        });
      });
    } else {
      info.message = 'Registrant found';
      info.registrant = regData;

      retailer.findOne({
        retailer: regData.retailer
      }, (retErr, retData) => {
        info.message = 'Retailer data not found';

        if (retErr) return res.status(500).send(retErr);
        if (!retData) return res.status(200).send(info);

        info.message = 'Success';
        info.retailer = retData;
        return res.status(200).send(info);
      });
    }
  });
});

// create new registrant
router.post('/registrants', (req, res) => {
  registrant.create(req.body, (err, registrant) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(registrant);
  });
});

// get all registrants
router.get('/registrants', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send({ message: 'User is not authenticated' });
  registrant.find({}, (err, registrants) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(registrants);
  });
});

// get one registrant
router.get('/registrants/:id', (req, res) => {
  registrant.findById(req.params.id, (err, registrant) => {
    const notFound = {
      message: 'Registrant not in system'
    };
    if (err) return res.status(500).send(err);
    if (!registrant) return res.status(200).send(notFound);
    return res.status(200).send(registrant);
  });
});

// delete registrant
router.delete('/registrants/:id', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send({ message: 'User is not authenticated' });
  registrant.findByIdAndRemove(req.params.id, (err, registrant) => {
    const deleted = {
      message: 'Registrant deleted'
    };
    if (err) return res.status(500).send(err);
    res.status(200).send(deleted);
  });
});

// update registrant
router.put('/registrants/:id', (req, res) => {
  registrant.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  }, (err, registrant) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(registrant);
  });
});

module.exports = router;
