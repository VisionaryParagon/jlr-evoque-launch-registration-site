const express = require('express');
const router = express.Router();

// models
const registrants = require('../models/registrant');
const employees = require('../models/employee');
const retailers = require('../models/retailer');
const waves = require('../models/wave');

// login registrant
router.post('/registrants/login', (req, res) => {
  registrants.findOne({
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
      employees.findOne({
        jlr_id: req.body.jlr_id
      }, (empErr, empData) => {
        info.message = 'Employee data not found';

        if (empErr) return res.status(500).send(empErr);
        if (!empData) return res.status(200).send(info);

        retailers.findOne({
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

      retailers.findOne({
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

// verify training ID
router.post('/registrants/verify', (req, res) => {
  registrants.findOne({
    jlr_id: req.body.jlr_id
  }, (regErr, regData) => {
    const info = {
      valid: false,
      message: 'This Training ID is already registered'
    };
    if (regErr) return res.status(500).send(regErr);
    if (!regData) {
      employees.findOne({
        jlr_id: req.body.jlr_id
      }, (empErr, empData) => {
        if (empErr) return res.status(500).send(empErr);

        info.message = 'Your Training ID is invalid or you are not authorized to attend this event';
        if (!empData) return res.status(200).send(info);

        info.valid = true;
        info.message = 'Valid';
        return res.status(200).send(info);
      });
    } else {
      return res.status(200).send(info);
    }
  });
});

// get registration form options
router.get('/registrants/options', (req, res) => {
  const options = {
    jobs: [],
    retailers: []
  };

  employees.find({}, (empErr, empData) => {
    if (empErr) return res.status(500).send(empErr);

    const jobs = empData.map(emp => emp.job);
    options.jobs = [...new Set(jobs)].sort();

    retailers.find({}, (retErr, retData) => {
      if (retErr) return res.status(500).send(retErr);

      const rets = retData.map(ret => ret.retailer)
      options.retailers = [...new Set(rets)].sort();

      return res.status(200).send(options);
    });
  });
});

// get caps with retailer
router.post('/registrants/caps', (req, res) => {
  const waveInfo = [];

  retailers.findOne({
    retailer: req.body.retailer
  }, (retErr, retData) => {
    if (retErr) return res.status(500).send(retErr);
    if (!retData) return res.status(200).send({ message: 'Retailer not found' });

    const hasHotel = retData.hotel;
    const retailerRooms = retData.rooms;
    const retailerSeats = retData.seats;
    const retailerWaves = retData.waves;

    waves.find({}, (wvErr, wvData) => {
      if (wvErr) return res.status(500).send(wvErr);

      // wave cap data for retailer
      const waveArray = [].concat(...retailerWaves.map(wv => wvData.filter(data => data.wave === wv)));

      registrants.find({}, (regErr, regData) => {
        if (regErr) return res.status(500).send(regErr);

        // registrants with retailer
        const regRetailerArray = regData.filter(reg => reg.retailer === req.body.retailer);
        // registrants with same waves as retailer
        const regWavesArray = [].concat(...retailerWaves.map(wv => regData.filter(reg => reg.wave === wv)));

        // determine cap for each wave
        retailerWaves.forEach(wv => {
          const info = {
            wave: wv,
            retailerCapped: false,
            waveCapped: false
          };
          // wave cap data
          const wave = waveArray.filter(reg => reg.wave === wv)[0];
          const roomCap = wave.rooms;
          const seatCap = wave.seats - roomCap;
          // registrants with wave
          const regWaveArray = regWavesArray.filter(reg => reg.wave === wv);
          // registrants with wave and hotel
          const regWaveHotel = regWaveArray.filter(reg => reg.hotel);
          // registrants with wave and no hotel
          const regWaveLocal = regWaveArray.filter(reg => !reg.hotel);

          if (hasHotel) {
            // test registrants with retailer vs allotted rooms
            if (regRetailerArray.length >= retailerRooms) {
              info.retailerCapped = true;
              waveInfo.push(info);
            // test registrants with wave and hotel vs wave room cap
            } else if (regWaveHotel.length >= roomCap || regWaveArray.length >= wave.seats) {
              info.waveCapped = true;
              waveInfo.push(info);
            } else {
              waveInfo.push(info);
            }
          } else {
            // test registrants with retailer vs allotted seats
            if (regRetailerArray.length >= retailerSeats) {
              info.retailerCapped = true;
              waveInfo.push(info);
            // test registrants with wave and no hotel vs wave seat cap (minus wave room cap)
            } else if (regWaveLocal.length >= seatCap || regWaveArray.length >= wave.seats) {
              info.waveCapped = true;
              waveInfo.push(info);
            } else {
              waveInfo.push(info);
            }
          }
        });

        return res.status(200).send(waveInfo);
      });
    });
  });
});

// get all caps
router.get('/registrants/all-caps', (req, res) => {
  const waveInfo = [];

  waves.find({}, (wvErr, wvData) => {
    if (wvErr) return res.status(500).send(wvErr);

    registrants.find({}, (regErr, regData) => {
      if (regErr) return res.status(500).send(regErr);

      // determine cap for each wave
      wvData.forEach(wv => {
        const info = {
          wave: wv.wave,
          waveCapped: false
        };
        // wave cap data
        const seatCap = wv.seats;
        // registrants with wave
        const regWaveArray = regData.filter(reg => reg.wave === wv.wave);
      
        // test registrants with wave and no hotel vs wave seat cap (minus wave room cap)
        if (regWaveArray.length >= seatCap) {
          info.waveCapped = true;
          waveInfo.push(info);
        } else {
          waveInfo.push(info);
        }
      });

      return res.status(200).send(waveInfo);
    });
  });
});

// create new registrant
router.post('/registrants', (req, res) => {
  registrants.create(req.body, (err, registrant) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(registrant);
  });
});

// get all registrants
router.get('/registrants', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send({ message: 'User is not authenticated' });
  registrants.find({}, (err, registrants) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(registrants);
  });
});

// get one registrant
router.get('/registrants/:id', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send({ message: 'User is not authenticated' });
  registrants.findById(req.params.id, (err, registrant) => {
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
  registrants.findByIdAndRemove(req.params.id, (err, registrant) => {
    const deleted = {
      message: 'Registrant deleted'
    };
    if (err) return res.status(500).send(err);
    res.status(200).send(deleted);
  });
});

// update registrant
router.put('/registrants/:id', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send({ message: 'User is not authenticated' });
  registrants.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  }, (err, registrant) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(registrant);
  });
});

module.exports = router;
