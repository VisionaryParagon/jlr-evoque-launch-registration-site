const express = require('express');
const router = express.Router();

// employees model
const employees = require('../models/employee');

// get all employees
router.get('/employees', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send({ message: 'User is not authenticated' });
  employees.find({}, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(data);
  });
});

// get one employee
router.get('/employees/:id', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send({ message: 'User is not authenticated' });
  employees.findById(req.params.id, (err, data) => {
    const notFound = {
      message: 'Employee not in system'
    };
    if (err) return res.status(500).send(err);
    if (!data) return res.status(200).send(notFound);
    return res.status(200).send(data);
  });
});

// create new employee
router.post('/employees', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send({ message: 'User is not authenticated' });
  employees.find({
    jlr_id: req.body.jlr_id
  }, (findErr, findData) => {
    if (findErr) return res.status(500).send(findErr);
    if (findData.length > 0) return res.status(200).send({ retailer: 'Employee already exists' });

    employees.create(req.body, (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(data);
    });
  });
});

// delete employee
router.delete('/employees/:id', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send({ message: 'User is not authenticated' });
  employees.findByIdAndRemove(req.params.id, (err, data) => {
    let deleted = {
      message: 'Employee deleted'
    };
    if (err) return res.status(500).send(err);
    res.status(200).send(deleted);
  });
});

// update employee
router.put('/employees/:id', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send({ message: 'User is not authenticated' });
  employees.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  }, (err, data) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(data);
  });
});

module.exports = router;
