const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const smtpConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPWD
  }
};

const transporter = nodemailer.createTransport(smtpConfig);

const moment = require('moment');

// contact emails
router.post('/contact', function (req, res) {
  // get contact data
  const data = req.body;

  // Internal response
  const textContentMsg = `
    New contact form inquiry from ${data.first_name} ${data.last_name} (${data.email}).

    Retailer: ${data.retailer}

    Message:
    ${data.message}
  `;

  const htmlContentMsg = `
    <div style="font-size:14px; margin:30px auto 60px; width:640px;">
      <span>
        New contact form inquiry from ${data.first_name} ${data.last_name} (<a href="mailto:${data.email}">${data.email}</a>).<br><br>

        Retailer: ${data.retailer}<br><br>

        Message:<br>
        ${data.message.split('\n').join('<br>')}
      </span>
    </div>
  `;

  const mailOptionsMsg = {
    from: '"JLR Event Support Team" <info@landroverlaunches.com>', // sender address
    to: '"JLR Event Support Team" <info@landroverlaunches.com>', // list of receivers
    replyTo: data.email, // list of replyTo's
    subject: 'Contact Form Inquiry from ' + data.first_name + ' ' + data.last_name, // Subject line
    text: textContentMsg, // plaintext body
    html: htmlContentMsg // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptionsMsg, function (error, info) {
    if (error) {
      return res.status(500).send(error);
      // return console.log(error);
    } else {
      return res.status(250).send(info);
      // return console.log('Message sent: ', info.response);
    }
  });

  // External response
  const textContentMsg2 = `
    Thank you for contacting the JLR Event Support Team.

    We have received your inquiry and will respond within 24 hours.

    Thank you,

    The JLR Event Support Team
  `;

  const htmlContentMsg2 = `
    <div id="email">
      <link rel="stylesheet" href="https://s3-us-west-1.amazonaws.com/landroverlaunches.com/css/fonts.css">
      <link rel="stylesheet" href="https://s3-us-west-1.amazonaws.com/landroverlaunches.com/css/email-reset.css">
      <div style="margin:30px auto; max-width:768px; min-width:290px; text-align:center; width:90%;">
        <div style="color:#0c121c; font-family:'Avenir LT Std', Arial, Helvetica, sans-serif; font-weight:400; margin:45px auto 60px; min-height:200px; min-width:200px; text-align:left; width:80%;">
          <span style="font-size:14px; line-height:1.4;">
            Thank you for contacting the JLR Event Support&nbsp;Team.<br><br>

            We have received your inquiry and will respond within 24&nbsp;hours.<br><br>

            Thank you,<br><br>

            The JLR Event Support Team
          </span>
        </div>
      </div>
    </div>
  `;

  const mailOptionsMsg2 = {
    from: '"JLR Event Support Team" <info@landroverlaunches.com>', // sender address
    to: data.email, // list of receivers
    subject: 'New Range Rover Evoque Launch Tour', // Subject line
    text: textContentMsg2, // plaintext body
    html: htmlContentMsg2 // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptionsMsg2, function (error, info) {
    if (error) {
      return res.status(500).send(error);
      // return console.log(error);
    } else {
      return res.status(250).send(info);
      // return console.log('Message sent: ', info.response);
    }
  });
});


// confirmation emails
router.post('/confirmation', function (req, res) {
  // get registrant data
  const data = req.body;
  const waveDate = data.wave.split(' - ')[0] + ', 2019';
  const hotelDate = moment(waveDate, 'dddd, MMMM D, YYYY').subtract(1, 'days').format('dddd, MMMM D');
  let waveTextInfo = '';
  let waveHtmlInfo = '';

  if (data.wave.indexOf('Miami, FL') !== -1 && data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Miami, FL!

    Training Venue:
    Marriott Miami Airport
    1201 NW LeJeune Rd Building A
    Miami, FL 33126

    TRAVEL & GROUND TRANSPORTATION

    If you are flying to the event:

    •	Please know that you will be responsible for your flight cost.
    •	If you need to fly to the event, please fly to MIA airport due to the location of the training.
        o	When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave date.
        o	When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:30 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and boarding.
    •	Marriott Miami Airport offers complimentary shuttle transportation to and from MIA airport. We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own expense.
        o	Shuttle Instructions: The hotel’s complimentary shuttle service is available between 5am and 1am. Once you have landed and retrieved your bag from baggage claim, proceed to the 2nd floor departures level. Once outside, stand between doors 6 through 33 for pickup and look for the black shuttle with the large red “M” on the side. When you see the shuttle, signal the driver for pickup.
    
    If you are driving to the event:
    
    •	Self-parking charges will be covered by JLR at the event site.
    
    HOTEL AND LODGING
    
    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night prior to your training wave.
    
    The Land Rover events team will book your hotel room on your behalf at Marriott Miami Airport for the night of ${hotelDate}. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon check-in.
    
    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own expense.
    
    Breakfast & registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30 a.m.
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the training.
    
    PLEASE NOTE THE FOLLOWING
    
    •	Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your own.
    •	Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.    
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in Miami,&nbsp;FL!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Marriott Miami Airport</strong><br>
    1201 NW LeJeune Rd Building A<br>
    Miami, FL 33126<br><br>

    <strong>TRAVEL &amp; GROUND TRANSPORTATION</strong><br><br>

    <strong>If you are <em>flying</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Please know that you will be responsible for your flight&nbsp;cost.</li>
      <li style="Margin:0;">If you need to fly to the event, please fly to MIA airport due to the location of the&nbsp;training.
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave&nbsp;date.</li>
          <li style="Margin:0;">When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:30 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and&nbsp;boarding.</li>
        </ul>
      </li>
      <li style="Margin:0;"><strong>Marriott Miami Airport</strong> offers complimentary shuttle transportation to and from MIA airport. We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own&nbsp;expense.
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">Shuttle Instructions: The hotel’s complimentary shuttle service is available between 5am and 1am. Once you have landed and retrieved your bag from baggage claim, proceed to the 2<sup style="font-size:10px;">nd</sup> floor departures level. Once outside, stand between doors 6 through 33 for pickup and look for the black shuttle with the large red “M” on the side. When you see the shuttle, signal the driver for&nbsp;pickup.</li>
        </ul>
      </li>
    </ul><br>

    <strong>If you are <em>driving</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Self-parking charges will be covered by JLR at the event&nbsp;site.</li>
    </ul><br>

    <strong>HOTEL AND LODGING</strong><br><br>

    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night <em>prior</em> to your training&nbsp;wave.<br><br>

    The Land Rover events team will book your hotel room on your behalf at <strong>Marriott Miami Airport</strong> for the night of <strong>${hotelDate}</strong>. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon&nbsp;check-in.<br><br>

    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own&nbsp;expense.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30&nbsp;a.m.<br><br>
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the&nbsp;training.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your&nbsp;own.</li>
      <li style="Margin:0;">Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Miami, FL') !== -1 && !data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Miami, FL! 

    Training Venue:
    Marriott Miami Airport
    1201 NW LeJeune Rd Building A
    Miami, FL 33126

    TRAVELING TO THE EVENT

    Due to your retailer’s proximity to the training location, a hotel room has not been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at (305) 649-5000 to check availability.

    Breakfast & registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign in.

    Self-parking charges for your vehicle will be covered by JLR at the training location.

    PLEASE NOTE THE FOLLOWING

    •	Breakfast, lunch, and refreshments will be provided on your event day.
    •	Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in Miami,&nbsp;FL!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Marriott Miami Airport</strong><br>
    1201 NW LeJeune Rd Building A<br>
    Miami, FL 33126<br><br>

    <strong>TRAVELING TO THE EVENT</strong><br><br>

    Due to your retailer’s proximity to the training location, a hotel room has <strong>not</strong> been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at <a href="tel:(305)649-5000" style="color:#0c121c;">(305)&nbsp;649&#8209;5000</a> to check&nbsp;availability.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign&nbsp;in.<br><br>
    
    Self-parking charges for your vehicle will be covered by JLR at the training&nbsp;location.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event&nbsp;day.</li>
      <li style="Margin:0;">Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Irving, TX') !== -1 && data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Irving, Texas!

    Training Venue:
    Doubletree by Hilton DFW North
    4441 W John Carpenter Freeway
    Irving, TX 75063

    TRAVEL & GROUND TRANSPORTATION

    If you are flying to the event:

    •	Please know that you will be responsible for your flight cost.
    •	If you need to fly to the event, please fly to DFW airport due to the location of the training.
        o	When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave date.
        o	When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:30 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and boarding.
    •	Doubletree by Hilton DFW North offers complimentary shuttle transportation to and from DFW airport. (We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own expense.)
        o	Shuttle Instructions: Shuttle Instructions: Once you have landed and retrieved your bag from baggage claim, call (972) 929-8181 to have the hotel shuttle pick you up at the nearest pickup point. A shuttle driver should meet you within 30 minutes.
    
    If you are driving to the event:
    
    •	Self-parking charges will be covered by JLR at the event site.
    
    HOTEL AND LODGING
    
    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night prior to your training wave.
    
    The Land Rover events team will book your hotel room on your behalf at Doubletree by Hilton DFW North for the night of ${hotelDate}. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon check-in.
    
    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own expense.
    
    Breakfast & registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30 a.m.
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the training.
    
    PLEASE NOTE THE FOLLOWING
    
    •	Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your own.
    •	Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.    
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in Irving,&nbsp;Texas!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Doubletree by Hilton DFW North</strong><br>
    4441 W John Carpenter Freeway<br>
    Irving, TX 75063<br><br>

    <strong>TRAVEL &amp; GROUND TRANSPORTATION</strong><br><br>

    <strong>If you are <em>flying</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Please know that you will be responsible for your flight&nbsp;cost.</li>
      <li style="Margin:0;">If you need to fly to the event, please fly to DFW airport due to the location of the&nbsp;training.
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave&nbsp;date.</li>
          <li style="Margin:0;">When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:30 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and&nbsp;boarding.</li>
        </ul>
      </li>
      <li style="Margin:0;"><strong>Doubletree by Hilton DFW North</strong> offers complimentary shuttle transportation to and from DFW airport. (We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own&nbsp;expense.)
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">Shuttle Instructions: Shuttle Instructions: Once you have landed and retrieved your bag from baggage claim, call <a href="tel:(972)929-8181" style="color:#0c121c;">(972)&nbsp;929&#8209;8181</a> to have the hotel shuttle pick you up at the nearest pickup point. A shuttle driver should meet you within 30&nbsp;minutes.</li>
        </ul>
      </li>
    </ul><br>

    <strong>If you are <em>driving</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Self-parking charges will be covered by JLR at the event&nbsp;site.</li>
    </ul><br>

    <strong>HOTEL AND LODGING</strong><br><br>

    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night <em>prior</em> to your training&nbsp;wave.<br><br>

    The Land Rover events team will book your hotel room on your behalf at <strong>Doubletree by Hilton DFW North</strong> for the night of <strong>${hotelDate}</strong>. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon&nbsp;check-in.<br><br>

    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own&nbsp;expense.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30&nbsp;a.m.<br><br>
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the&nbsp;training.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your&nbsp;own.</li>
      <li style="Margin:0;">Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Irving, TX') !== -1 && !data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Irving, Texas! 

    Training Venue:
    Doubletree by Hilton DFW North
    4441 W John Carpenter Freeway
    Irving, TX 75063

    TRAVELING TO THE EVENT

    Due to your retailer’s proximity to the training location, a hotel room has not been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at (972) 929-8181 to check availability.

    Breakfast & registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign in.

    Self-parking charges for your vehicle will be covered by JLR at the training location.

    PLEASE NOTE THE FOLLOWING

    •	Breakfast, lunch, and refreshments will be provided on your event day.
    •	Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in Irving,&nbsp;Texas!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Doubletree by Hilton DFW North</strong><br>
    4441 W John Carpenter Freeway<br>
    Irving, TX 75063<br><br>

    <strong>TRAVELING TO THE EVENT</strong><br><br>

    Due to your retailer’s proximity to the training location, a hotel room has <strong>not</strong> been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at <a href="tel:(972)929-8181" style="color:#0c121c;">(972)&nbsp;929&#8209;8181</a> to check&nbsp;availability.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign&nbsp;in.<br><br>
    
    Self-parking charges for your vehicle will be covered by JLR at the training&nbsp;location.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event&nbsp;day.</li>
      <li style="Margin:0;">Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Rosemont, IL') !== -1 && data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Chicago!

    Training Venue:
    Sheraton Suites O’Hare Airport 
    6501 Mannheim Rd
    Rosemont, IL 60018

    TRAVEL & GROUND TRANSPORTATION

    If you are flying to the event:

    •	Please know that you will be responsible for your flight cost.
    •	If you need to fly to the event, please fly to ORD airport due to the location of the training.
        o	When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave date.
        o	When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:30 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and boarding.
    •	Sheraton Suites O’Hare Airport offers complimentary shuttle transportation to and from ORD airport. We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own expense.
        o	Shuttle Instructions: To access the complimentary hotel shuttle, you will need to walk to the shuttle bus center after you retrieve your luggage from baggage claim.
            	From Terminals 1, 2 and 3: look for the red and blue arrows on the floor at the baggage claim level. Look also for the red and blue sign overhead which reads “Bus Shuttle Center.”
            	Follow the signs which will lead to an escalator. Take the escalator down one level. 
            	Continue to follow the signs, which will lead to elevator banks #3 and/or #4. Take either set of elevators up one level.
            	Proceed into Bus Shuttle Center and wait at door #3. (NOTE: When standing at door #3, you will be standing across the street from the Hilton hotel.)

    
    If you are driving to the event:
    
    •	Self-parking charges will be covered by JLR at the event site.
    
    HOTEL AND LODGING
    
    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night prior to your training wave.
    
    The Land Rover events team will book your hotel room on your behalf at Sheraton Suites O’Hare Airport for the night of ${hotelDate}. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon check-in.
    
    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own expense.
    
    Breakfast & registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30 a.m.
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the training.
    
    PLEASE NOTE THE FOLLOWING
    
    •	Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your own.
    •	Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.    
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in&nbsp;Chicago!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Sheraton Suites O’Hare Airport</strong><br>
    6501 Mannheim Rd<br>
    Rosemont, IL 60018<br><br>

    <strong>TRAVEL &amp; GROUND TRANSPORTATION</strong><br><br>

    <strong>If you are <em>flying</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Please know that you will be responsible for your flight&nbsp;cost.</li>
      <li style="Margin:0;">If you need to fly to the event, please fly to ORD airport due to the location of the&nbsp;training.
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave&nbsp;date.</li>
          <li style="Margin:0;">When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:30 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and&nbsp;boarding.</li>
        </ul>
      </li>
      <li style="Margin:0;"><strong>Sheraton Suites O’Hare Airport</strong> offers complimentary shuttle transportation to and from ORD airport. We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own&nbsp;expense.
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">Shuttle Instructions: To access the complimentary hotel shuttle, you will need to walk to the shuttle bus center after you retrieve your luggage from baggage&nbsp;claim.
            <ul style="padding: 0; Margin: 0 0 0 25px;">
              <li style="Margin:0;">From Terminals 1, 2 and 3: look for the red and blue arrows on the floor at the baggage claim level. Look also for the red and blue sign overhead which reads “Bus Shuttle&nbsp;Center.”</li>
              <li style="Margin:0;">Follow the signs which will lead to an escalator. Take the escalator down one&nbsp;level.</li>
              <li style="Margin:0;">Continue to follow the signs, which will lead to elevator banks #3 and/or #4. Take either set of elevators up one&nbsp;level.</li>
              <li style="Margin:0;">Proceed into Bus Shuttle Center and wait at door #3. (NOTE: When standing at door #3, you will be standing across the street from the Hilton&nbsp;hotel.)</li>
            </ul>
          </li>
        </ul>
      </li>
    </ul><br>

    <strong>If you are <em>driving</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Self-parking charges will be covered by JLR at the event&nbsp;site.</li>
    </ul><br>

    <strong>HOTEL AND LODGING</strong><br><br>

    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night <em>prior</em> to your training&nbsp;wave.<br><br>

    The Land Rover events team will book your hotel room on your behalf at <strong>Sheraton Suites O’Hare Airport</strong> for the night of <strong>${hotelDate}</strong>. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon&nbsp;check-in.<br><br>

    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own&nbsp;expense.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30&nbsp;a.m.<br><br>
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the&nbsp;training.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your&nbsp;own.</li>
      <li style="Margin:0;">Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Rosemont, IL') !== -1 && !data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Chicago! 

    Training Venue:
    Sheraton Suites O’Hare Airport 
    6501 Mannheim Rd
    Rosemont, IL 60018

    TRAVELING TO THE EVENT

    Due to your retailer’s proximity to the training location, a hotel room has not been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at (847) 699-6300 to check availability.

    Breakfast & registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign in.

    Self-parking charges for your vehicle will be covered by JLR at the training location.

    PLEASE NOTE THE FOLLOWING

    •	Breakfast, lunch, and refreshments will be provided on your event day.
    •	Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in&nbsp;Chicago!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Sheraton Suites O’Hare Airport</strong><br>
    6501 Mannheim Rd<br>
    Rosemont, IL 60018<br><br>

    <strong>TRAVELING TO THE EVENT</strong><br><br>

    Due to your retailer’s proximity to the training location, a hotel room has <strong>not</strong> been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at <a href="tel:(847)699-6300" style="color:#0c121c;">(847)&nbsp;699&#8209;6300</a> to check&nbsp;availability.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign&nbsp;in.<br><br>
    
    Self-parking charges for your vehicle will be covered by JLR at the training&nbsp;location.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event&nbsp;day.</li>
      <li style="Margin:0;">Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Santa Ana, CA') !== -1 && data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Orange County, California!

    Training Venue:
    Doubletree by Hilton Santa Ana – Orange County Airport 
    201 East MacArthur Blvd. 
    Santa Ana, CA 92707

    TRAVEL & GROUND TRANSPORTATION

    If you are flying to the event:

    •	Please know that you will be responsible for your flight cost.
    •	You should plan to fly into Orange County Airport (SNA) due to the location of the training.
        o	When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave date.
        o	When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:00 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and boarding.
    •	Doubletree by Hilton Santa Ana – Orange County Airport offers complimentary shuttle transportation to and from SNA airport. (We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own expense.)
        o	Shuttle Instructions: Complimentary shuttle transportation is offered between 5:30 am and 11:00 pm. When you land and have collected your luggage from baggage claim, please call (714) 825-3333 to let the hotel know you are awaiting pickup. Follow the signs to Ground Transportation (specifically you will need to go to the area labeled Courtesy Shuttles) and this is where you will meet your shuttle.

    
    If you are driving to the event:
    
    •	Self-parking charges will be covered by JLR at the event site.
    
    HOTEL AND LODGING
    
    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night prior to your training wave.
    
    The Land Rover events team will book your hotel room on your behalf at Doubletree by Hilton Santa Ana – Orange County Airport for the night of ${hotelDate}. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon check-in.
    
    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own expense.
    
    Breakfast & registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30 a.m.
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the training.
    
    PLEASE NOTE THE FOLLOWING
    
    •	Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your own.
    •	Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.    
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in Orange County,&nbsp;California!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Doubletree by Hilton Santa Ana &ndash; Orange County Airport</strong><br>
    201 East MacArthur Blvd.<br>
    Santa Ana, CA 92707<br><br>

    <strong>TRAVEL &amp; GROUND TRANSPORTATION</strong><br><br>

    <strong>If you are <em>flying</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Please know that you will be responsible for your flight&nbsp;cost.</li>
      <li style="Margin:0;">You should plan to fly into Orange County Airport (SNA) due to the location of the&nbsp;training.
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave&nbsp;date.</li>
          <li style="Margin:0;">When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:00 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and&nbsp;boarding.</li>
        </ul>
      </li>
      <li style="Margin:0;"><strong>Doubletree by Hilton Santa Ana &ndash; Orange County Airport</strong> offers complimentary shuttle transportation to and from SNA airport. (We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own&nbsp;expense.)
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">Shuttle Instructions: Complimentary shuttle transportation is offered between 5:30 am and 11:00 pm. When you land and have collected your luggage from baggage claim, please call <a href="tel:(714)825-3333" style="color:#0c121c;">(714)&nbsp;825&#8209;3333</a> to let the hotel know you are awaiting pickup. Follow the signs to Ground Transportation (specifically you will need to go to the area labeled Courtesy Shuttles) and this is where you will meet your&nbsp;shuttle.</li>
        </ul>
      </li>
    </ul><br>

    <strong>If you are <em>driving</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Self-parking charges will be covered by JLR at the event&nbsp;site.</li>
    </ul><br>

    <strong>HOTEL AND LODGING</strong><br><br>

    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night <em>prior</em> to your training&nbsp;wave.<br><br>

    The Land Rover events team will book your hotel room on your behalf at <strong>Doubletree by Hilton Santa Ana &ndash; Orange County Airport</strong> for the night of <strong>${hotelDate}</strong>. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon&nbsp;check-in.<br><br>

    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own&nbsp;expense.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30&nbsp;a.m.<br><br>
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the&nbsp;training.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your&nbsp;own.</li>
      <li style="Margin:0;">Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Santa Ana, CA') !== -1 && !data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Orange County, California! 

    Training Venue:
    Doubletree by Hilton Santa Ana – Orange County Airport 
    201 East MacArthur Blvd. 
    Santa Ana, CA 92707

    TRAVELING TO THE EVENT

    Due to your retailer’s proximity to the training location, a hotel room has not been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at (714) 825-3333 to check availability.

    Breakfast & registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign in.

    Self-parking charges for your vehicle will be covered by JLR at the training location.

    PLEASE NOTE THE FOLLOWING

    •	Breakfast, lunch, and refreshments will be provided on your event day.
    •	Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in Orange County,&nbsp;California!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Doubletree by Hilton Santa Ana &ndash; Orange County Airport</strong><br>
    201 East MacArthur Blvd.<br>
    Santa Ana, CA 92707<br><br>

    <strong>TRAVELING TO THE EVENT</strong><br><br>

    Due to your retailer’s proximity to the training location, a hotel room has <strong>not</strong> been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at <a href="tel:(714)825-3333" style="color:#0c121c;">(714)&nbsp;825&#8209;3333</a> to check&nbsp;availability.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign&nbsp;in.<br><br>
    
    Self-parking charges for your vehicle will be covered by JLR at the training&nbsp;location.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event&nbsp;day.</li>
      <li style="Margin:0;">Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Oakland, CA') !== -1 && data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Oakland, California!

    Training Venue:
    Hilton Oakland Airport
    1 Hegenberger Rd
    Oakland, CA 94621

    TRAVEL & GROUND TRANSPORTATION

    If you are flying to the event:

    •	Please know that you will be responsible for your flight cost.
    •	You should plan to fly into Oakland airport (OAK) due to the location of the training.
        o	When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave date.
        o	When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:00 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and boarding.
    •	Hilton Oakland Airport offers complimentary shuttle transportation to and from OAK airport. (We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own expense.)
        o	Shuttle Instructions: Upon deplaning and collecting your baggage, follow the signs to the Hotel Shuttles area. You will need to be standing at the 4B or 4G area specifically and look for the Hilton shuttle van. Shuttles cycle approximately every 20 minutes, but if you have any questions you may contact the hotel at (510) 635-5000 to confirm the next available pick-up time.

    
    If you are driving to the event:
    
    •	Self-parking charges will be covered by JLR at the event site.
    
    HOTEL AND LODGING
    
    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night prior to your training wave.
    
    The Land Rover events team will book your hotel room on your behalf at Hilton Oakland Airport for the night of ${hotelDate}. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon check-in.
    
    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own expense.
    
    Breakfast & registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30 a.m.
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the training.
    
    PLEASE NOTE THE FOLLOWING
    
    •	Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your own.
    •	Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.    
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in Oakland,&nbsp;California!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Hilton Oakland Airport</strong><br>
    1 Hegenberger Rd<br>
    Oakland, CA 94621<br><br>

    <strong>TRAVEL &amp; GROUND TRANSPORTATION</strong><br><br>

    <strong>If you are <em>flying</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Please know that you will be responsible for your flight&nbsp;cost.</li>
      <li style="Margin:0;">You should plan to fly into Oakland airport (OAK) due to the location of the&nbsp;training.
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave&nbsp;date.</li>
          <li style="Margin:0;">When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:00 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and&nbsp;boarding.</li>
        </ul>
      </li>
      <li style="Margin:0;"><strong>Hilton Oakland Airport</strong> offers complimentary shuttle transportation to and from OAK airport. (We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own&nbsp;expense.)
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">Shuttle Instructions: Upon deplaning and collecting your baggage, follow the signs to the Hotel Shuttles area. You will need to be standing at the <strong>4B</strong> or <strong>4G</strong> area specifically and look for the Hilton shuttle van. Shuttles cycle approximately every 20 minutes, but if you have any questions you may contact the hotel at <a href="tel:(510)635-5000" style="color:#0c121c;">(510)&nbsp;635&#8209;5000</a> to confirm the next available pick&#8209;up&nbsp;time.</li>
        </ul>
      </li>
    </ul><br>

    <strong>If you are <em>driving</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Self-parking charges will be covered by JLR at the event&nbsp;site.</li>
    </ul><br>

    <strong>HOTEL AND LODGING</strong><br><br>

    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night <em>prior</em> to your training&nbsp;wave.<br><br>

    The Land Rover events team will book your hotel room on your behalf at <strong>Hilton Oakland Airport</strong> for the night of <strong>${hotelDate}</strong>. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon&nbsp;check-in.<br><br>

    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own&nbsp;expense.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30&nbsp;a.m.<br><br>
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the&nbsp;training.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your&nbsp;own.</li>
      <li style="Margin:0;">Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Oakland, CA') !== -1 && !data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Oakland, California! 

    Training Venue:
    Hilton Oakland Airport
    1 Hegenberger Rd
    Oakland, CA 94621

    TRAVELING TO THE EVENT

    Due to your retailer’s proximity to the training location, a hotel room has not been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at (510) 635-5000 to check availability.

    Breakfast & registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign in.

    Self-parking charges for your vehicle will be covered by JLR at the training location.

    PLEASE NOTE THE FOLLOWING

    •	Breakfast, lunch, and refreshments will be provided on your event day.
    •	Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in Oakland,&nbsp;California!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Hilton Oakland Airport</strong><br>
    1 Hegenberger Rd<br>
    Oakland, CA 94621<br><br>

    <strong>TRAVELING TO THE EVENT</strong><br><br>

    Due to your retailer’s proximity to the training location, a hotel room has <strong>not</strong> been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at <a href="tel:(510)635-5000" style="color:#0c121c;">(510)&nbsp;635&#8209;5000</a> to check&nbsp;availability.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign&nbsp;in.<br><br>
    
    Self-parking charges for your vehicle will be covered by JLR at the training&nbsp;location.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event&nbsp;day.</li>
      <li style="Margin:0;">Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Mahwah, NJ') !== -1 && data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Mahwah, New Jersey!

    Training Venue:
    Jaguar Land Rover North American Headquarters
    100 Jaguar Land Rover Way
    Mahwah, NJ 07495

    TRAVEL & GROUND TRANSPORTATION

    •	If you fly to the event, we recommend flying to EWR airport due to its proximity to the training location. You will be responsible for your flight cost and for procuring ground transportation from your arrival airport to the Sheraton Mahwah Hotel.
        o	When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave date.
        o	When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 8:30 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and boarding.
    •	If you plan to drive to the event, you will be able to park at the Sheraton Mahwah (complimentary) and be shuttled to JLR North America for the training activities.
    
    HOTEL AND LODGING
    
    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night prior to your training wave.

    The host hotel is: 
    Sheraton Mahwah
    Route 17 North, 1 International Blvd
    Mahwah, NJ 07495
    
    You do not need to call the hotel to book your room. The Land Rover events team will book your hotel room on your behalf at the Sheraton Mahwah for the night of ${hotelDate}. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon check-in.

    Shuttle transportation will be provided to you between the hotel and the event site on the day of your training wave. Shuttle transportation will depart the Sheraton Mahwah for JLR North American Headquarters promptly at 7:40 a.m. on the morning of your training. Please check out of your hotel room prior to boarding the shuttle and bring your luggage with you.
    
    You will have the option of riding the event shuttle to Newark Liberty International Airport (EWR) immediately following your training wave.
    
    PLEASE NOTE THE FOLLOWING
    
    •	Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your own.
    •	Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.    
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in Mahwah, New&nbsp;Jersey!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Jaguar Land Rover North American Headquarters</strong><br>
    100 Jaguar Land Rover Way<br>
    Mahwah, NJ 07495<br><br>

    <strong>TRAVEL &amp; GROUND TRANSPORTATION</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">If you <em>fly</em> to the event, we recommend flying to EWR airport due to its proximity to the training location. You will be responsible for your flight cost and for procuring ground transportation from your arrival airport to the Sheraton Mahwah&nbsp;Hotel.
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave&nbsp;date.</li>
          <li style="Margin:0;">When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 8:30 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and&nbsp;boarding.</li>
        </ul>
      </li>
      <li style="Margin:0;">If you plan to <em>drive</em> to the event, you will be able to park at the Sheraton Mahwah (complimentary) and be shuttled to JLR North America for the training&nbsp;activities.</li>
    </ul><br>

    <strong>If you are <em>driving</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Self-parking charges will be covered by JLR at the event&nbsp;site.</li>
    </ul><br>

    <strong>HOTEL AND LODGING</strong><br><br>

    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night <em>prior</em> to your training&nbsp;wave.<br><br>

    The host hotel is:<br>
    <strong>Sheraton Mahwah</strong><br>
    Route 17 North, 1 International Blvd<br>
    Mahwah, NJ 07495<br><br>
    
    You do not need to call the hotel to book your room. The Land Rover events team will book your hotel room on your behalf at the <strong>Sheraton Mahwah</strong> for the night of <strong>${hotelDate}</strong>. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon check-in.<br><br>

    Shuttle transportation will be provided to you <em>between the hotel and the event site</em> on the day of your training wave. Shuttle transportation will depart the Sheraton Mahwah for JLR North American Headquarters promptly at 7:40 a.m. on the morning of your training. Please check out of your hotel room prior to boarding the shuttle and bring your luggage with&nbsp;you.<br><br>

    You will have the option of riding the event shuttle to Newark Liberty International Airport (EWR) immediately following your training&nbsp;wave.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your&nbsp;own.</li>
      <li style="Margin:0;">Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Mahwah, NJ') !== -1 && !data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Mahwah, New Jersey! 

    Training Venue:
    Jaguar Land Rover North American Headquarters
    100 Jaguar Land Rover Way
    Mahwah, NJ 07495

    TRAVELING TO THE EVENT

    Due to your retailer’s proximity to the training location, a hotel room has not been procured for you. Should you desire to book a hotel room in the area, you may do so at your own expense (the Sheraton Mahwah is the closest hotel and may be reached at (201) 529-1660.

    Breakfast & registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign in.

    PLEASE NOTE THE FOLLOWING

    •	Breakfast, lunch, and refreshments will be provided on your event day.
    •	Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in Mahwah, New&nbsp;Jersey!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Jaguar Land Rover North American Headquarters</strong><br>
    100 Jaguar Land Rover Way<br>
    Mahwah, NJ 07495<br><br>

    <strong>TRAVELING TO THE EVENT</strong><br><br>

    Due to your retailer’s proximity to the training location, a hotel room has <strong>not</strong> been procured for you. Should you desire to book a hotel room in the area, you may do so at your own expense (the Sheraton Mahwah is the closest hotel and may be reached at <a href="tel:(201)529-1660" style="color:#0c121c;">(201)&nbsp;529&#8209;1660</a>.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign&nbsp;in.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event&nbsp;day.</li>
      <li style="Margin:0;">Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Toronto, ON') !== -1 && data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Toronto!

    Training Venue:
    Hilton Garden Inn Toronto Airport
    3311 Caroga Dr
    Mississauga, ON L4V 1A3, Canada

    TRAVEL & GROUND TRANSPORTATION

    If you are flying to the event:

    •	Please know that you will be responsible for your flight cost.
    •	Please fly to Toronto Pearson (YYZ) airport due to the training location.
        o	When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave date.
        o	When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:30 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and boarding.
    •	Hilton Garden Inn Toronto Airport offers complimentary shuttle transportation to and from YYZ airport. We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own expense.
        o	Shuttle Instructions:
            	From Terminal 1, lower level: go to Post S5 and P3 and board Hilton Garden Inn Toronto Airport complimentary shuttle to hotel.
            	From Terminal 3, the pick-up location is Inner Curb, Post 35-43.
            	Should you have any questions you may call the hotel at (905) 678-0041.

    
    If you are driving to the event:
    
    •	Self-parking charges will be covered by JLR at the event site. Underground parking is available.
    
    HOTEL AND LODGING
    
    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night prior to your training wave.
    
    The Land Rover events team will book your hotel room on your behalf at Hilton Garden Inn Toronto Airport for the night of ${hotelDate}. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon check-in.
    
    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own expense.
    
    Breakfast & registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30 a.m.
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the training.
    
    PLEASE NOTE THE FOLLOWING
    
    •	Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your own.
    •	Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.    
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in&nbsp;Toronto!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Hilton Garden Inn Toronto Airport</strong><br>
    3311 Caroga Dr<br>
    Mississauga, ON L4V 1A3, Canada<br><br>

    <strong>TRAVEL &amp; GROUND TRANSPORTATION</strong><br><br>

    <strong>If you are <em>flying</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Please know that you will be responsible for your flight&nbsp;cost.</li>
      <li style="Margin:0;">Please fly to Toronto Pearson (YYZ) airport due to the training&nbsp;location.
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave&nbsp;date.</li>
          <li style="Margin:0;">When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:30 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and&nbsp;boarding.</li>
        </ul>
      </li>
      <li style="Margin:0;"><strong>Hilton Garden Inn Toronto Airport</strong> offers complimentary shuttle transportation to and from YYZ airport. We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own&nbsp;expense.
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">Shuttle Instructions:
            <ul style="padding: 0; Margin: 0 0 0 25px;">
              <li style="Margin:0;">From Terminal 1, lower level: go to Post S5 and P3 and board <strong>Hilton Garden Inn Toronto Airport</strong> complimentary shuttle to&nbsp;hotel.</li>
              <li style="Margin:0;">From Terminal 3, the pick-up location is Inner Curb, Post&nbsp;35&#8209;43.</li>
              <li style="Margin:0;">Should you have any questions you may call the hotel at <a href="tel:(905)678-0041" style="color:#0c121c;">(905)&nbsp;678&#8209;0041</a>.</li>
            </ul>
          </li>
        </ul>
      </li>
    </ul><br>

    <strong>If you are <em>driving</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Self-parking charges will be covered by JLR at the event site. Underground parking is&nbsp;available.</li>
    </ul><br>

    <strong>HOTEL AND LODGING</strong><br><br>

    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night <em>prior</em> to your training&nbsp;wave.<br><br>

    The Land Rover events team will book your hotel room on your behalf at <strong>Hilton Garden Inn Toronto Airport</strong> for the night of <strong>${hotelDate}</strong>. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon&nbsp;check-in.<br><br>

    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own&nbsp;expense.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30&nbsp;a.m.<br><br>
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the&nbsp;training.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your&nbsp;own.</li>
      <li style="Margin:0;">Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Toronto, ON') !== -1 && !data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Toronto! 

    Training Venue:
    Hilton Garden Inn Toronto Airport
    3311 Caroga Dr
    Mississauga, ON L4V 1A3, Canada

    TRAVELING TO THE EVENT

    Due to your retailer’s proximity to the training location, a hotel room has not been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at (905) 678-0041 to check availability.

    Breakfast & registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign in.

    Self-parking charges for your vehicle will be covered by JLR at the training location. Underground parking is available.

    PLEASE NOTE THE FOLLOWING

    •	Breakfast, lunch, and refreshments will be provided on your event day.
    •	Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in&nbsp;Toronto!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Hilton Garden Inn Toronto Airport</strong><br>
    3311 Caroga Dr<br>
    Mississauga, ON L4V 1A3, Canada<br><br>

    <strong>TRAVELING TO THE EVENT</strong><br><br>

    Due to your retailer’s proximity to the training location, a hotel room has <strong>not</strong> been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at <a href="tel:(905)678-0041" style="color:#0c121c;">(905)&nbsp;678&#8209;0041</a> to check&nbsp;availability.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign&nbsp;in.<br><br>
    
    Self-parking charges for your vehicle will be covered by JLR at the training location. Underground parking is&nbsp;available.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event&nbsp;day.</li>
      <li style="Margin:0;">Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  };

  const textContent = `
    ${waveTextInfo}

    QUESTIONS?

    If after registering you have questions, please consult our Frequently Asked Questions page, contact the JLR Event Support Team at info@landroverlaunches.com or call our toll-free helpline at (856) 351-5378.

    If you need to cancel your registration, please contact the JLR Event Support Team using the information above and please note the cancellation fee policy is as follows:

    •	7-14 days prior to event: $1,500
    •	0-7 days prior to event: $3,000
    •	No Shows will be charged: $3,000

    We look forward to seeing you at the New Range Rover Evoque North American Launch Training!

    Sincerely,

    The JLR Event Support Team
  `;

  const htmlContent = `
    <div id="email">
      <link rel="stylesheet" href="https://s3-us-west-1.amazonaws.com/landroverlaunches.com/css/fonts.css">
      <link rel="stylesheet" href="https://s3-us-west-1.amazonaws.com/landroverlaunches.com/css/email-reset.css">
      <div style="margin:30px auto; max-width:768px; min-width:290px; text-align:center; width:90%;">
        <div style="color:#0c121c; font-family:'Avenir LT Std', Arial, Helvetica, sans-serif; font-weight:400; margin:45px auto 60px; min-height:200px; min-width:200px; text-align:left; width:80%;">
          <span style="font-size:14px; line-height:1.4;">
            ${waveHtmlInfo}

            <span style="font-weight:bold;">QUESTIONS?</span><br><br>

            If after registering you have questions, please consult our <a href="https://landroverlaunches.com/faqs" style="color:#0c121c;">Frequently Asked Questions</a> page, contact the JLR Event Support Team at <a href="mailto:info@landroverlaunches.com" style="color:#0c121c;">info@landroverlaunches.com</a> or call our toll-free helpline at <a href="tel:(856)351-5378" style="color:#0c121c;">(856)&nbsp;351&#8209;5378</a>.<br><br>

            If you need to cancel your registration, please contact the JLR Event Support Team using the information above and please note the cancellation fee policy is as follows:<br><br>

            <ul style="padding: 0; Margin: 0 0 0 25px;">
              <li style="Margin:0;">7-14 days prior to event: $1,500</li>
              <li style="Margin:0;">0-7 days prior to event: $3,000</li>
              <li style="Margin:0;">No Shows will be charged: $3,000</li>
            </ul><br>

            We look forward to seeing you at the New Range Rover Evoque North American Launch Training!<br><br>
    
            Sincerely,<br><br>

            The Land Rover Events&nbsp;Team
          </span>
        </div>
      </div>
    </div>
  `;

  // send to registrant
  const mailOptions = {
    from: '"JLR Event Support Team" <info@landroverlaunches.com>', // sender address
    to: data.email, // list of receivers
    subject: 'Your registration is confirmed!', // Subject line
    text: textContent, // plaintext body
    html: htmlContent // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.status(500).send(error);
      // return console.log(error);
    } else {
      return res.status(250).send(info);
      // return console.log('Message sent: ', info.response);
    }
  });

  // send to admin
  const mailOptionsMsg = {
    from: '"JLR Event Support Team" <info@landroverlaunches.com>', // sender address
    to: '"JLR Event Support Team" <info@landroverlaunches.com>', // list of receivers
    replyTo: data.email, // list of replyTo's
    subject: 'Registration Confirmed for ' + data.first_name + ' ' + data.last_name, // Subject line
    text: textContent, // plaintext body
    html: htmlContent // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptionsMsg, function (error, info) {
    if (error) {
      return res.status(500).send(error);
      // return console.log(error);
    } else {
      return res.status(250).send(info);
      // return console.log('Message sent: ', info.response);
    }
  });
});


// updated info emails
router.post('/updated', function (req, res) {
  // get registrant data
  const data = req.body;
  const waveDate = data.wave.split(' - ')[0] + ', 2019';
  const hotelDate = moment(waveDate, 'dddd, MMMM D, YYYY').subtract(1, 'days').format('dddd, MMMM D');
  let waveTextInfo = '';
  let waveHtmlInfo = '';

  if (data.wave.indexOf('Miami, FL') !== -1 && data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Miami, FL!

    Training Venue:
    Marriott Miami Airport
    1201 NW LeJeune Rd Building A
    Miami, FL 33126

    TRAVEL & GROUND TRANSPORTATION

    If you are flying to the event:

    •	Please know that you will be responsible for your flight cost.
    •	If you need to fly to the event, please fly to MIA airport due to the location of the training.
        o	When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave date.
        o	When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:30 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and boarding.
    •	Marriott Miami Airport offers complimentary shuttle transportation to and from MIA airport. We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own expense.
        o	Shuttle Instructions: The hotel’s complimentary shuttle service is available between 5am and 1am. Once you have landed and retrieved your bag from baggage claim, proceed to the 2nd floor departures level. Once outside, stand between doors 6 through 33 for pickup and look for the black shuttle with the large red “M” on the side. When you see the shuttle, signal the driver for pickup.
    
    If you are driving to the event:
    
    •	Self-parking charges will be covered by JLR at the event site.
    
    HOTEL AND LODGING
    
    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night prior to your training wave.
    
    The Land Rover events team will book your hotel room on your behalf at Marriott Miami Airport for the night of ${hotelDate}. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon check-in.
    
    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own expense.
    
    Breakfast & registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30 a.m.
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the training.
    
    PLEASE NOTE THE FOLLOWING
    
    •	Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your own.
    •	Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.    
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in Miami,&nbsp;FL!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Marriott Miami Airport</strong><br>
    1201 NW LeJeune Rd Building A<br>
    Miami, FL 33126<br><br>

    <strong>TRAVEL &amp; GROUND TRANSPORTATION</strong><br><br>

    <strong>If you are <em>flying</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Please know that you will be responsible for your flight&nbsp;cost.</li>
      <li style="Margin:0;">If you need to fly to the event, please fly to MIA airport due to the location of the&nbsp;training.
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave&nbsp;date.</li>
          <li style="Margin:0;">When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:30 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and&nbsp;boarding.</li>
        </ul>
      </li>
      <li style="Margin:0;"><strong>Marriott Miami Airport</strong> offers complimentary shuttle transportation to and from MIA airport. We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own&nbsp;expense.
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">Shuttle Instructions: The hotel’s complimentary shuttle service is available between 5am and 1am. Once you have landed and retrieved your bag from baggage claim, proceed to the 2<sup style="font-size:10px;">nd</sup> floor departures level. Once outside, stand between doors 6 through 33 for pickup and look for the black shuttle with the large red “M” on the side. When you see the shuttle, signal the driver for&nbsp;pickup.</li>
        </ul>
      </li>
    </ul><br>

    <strong>If you are <em>driving</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Self-parking charges will be covered by JLR at the event&nbsp;site.</li>
    </ul><br>

    <strong>HOTEL AND LODGING</strong><br><br>

    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night <em>prior</em> to your training&nbsp;wave.<br><br>

    The Land Rover events team will book your hotel room on your behalf at <strong>Marriott Miami Airport</strong> for the night of <strong>${hotelDate}</strong>. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon&nbsp;check-in.<br><br>

    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own&nbsp;expense.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30&nbsp;a.m.<br><br>
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the&nbsp;training.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your&nbsp;own.</li>
      <li style="Margin:0;">Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Miami, FL') !== -1 && !data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Miami, FL! 

    Training Venue:
    Marriott Miami Airport
    1201 NW LeJeune Rd Building A
    Miami, FL 33126

    TRAVELING TO THE EVENT

    Due to your retailer’s proximity to the training location, a hotel room has not been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at (305) 649-5000 to check availability.

    Breakfast & registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign in.

    Self-parking charges for your vehicle will be covered by JLR at the training location.

    PLEASE NOTE THE FOLLOWING

    •	Breakfast, lunch, and refreshments will be provided on your event day.
    •	Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in Miami,&nbsp;FL!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Marriott Miami Airport</strong><br>
    1201 NW LeJeune Rd Building A<br>
    Miami, FL 33126<br><br>

    <strong>TRAVELING TO THE EVENT</strong><br><br>

    Due to your retailer’s proximity to the training location, a hotel room has <strong>not</strong> been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at <a href="tel:(305)649-5000" style="color:#0c121c;">(305)&nbsp;649&#8209;5000</a> to check&nbsp;availability.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign&nbsp;in.<br><br>
    
    Self-parking charges for your vehicle will be covered by JLR at the training&nbsp;location.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event&nbsp;day.</li>
      <li style="Margin:0;">Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Irving, TX') !== -1 && data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Irving, Texas!

    Training Venue:
    Doubletree by Hilton DFW North
    4441 W John Carpenter Freeway
    Irving, TX 75063

    TRAVEL & GROUND TRANSPORTATION

    If you are flying to the event:

    •	Please know that you will be responsible for your flight cost.
    •	If you need to fly to the event, please fly to DFW airport due to the location of the training.
        o	When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave date.
        o	When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:30 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and boarding.
    •	Doubletree by Hilton DFW North offers complimentary shuttle transportation to and from DFW airport. (We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own expense.)
        o	Shuttle Instructions: Shuttle Instructions: Once you have landed and retrieved your bag from baggage claim, call (972) 929-8181 to have the hotel shuttle pick you up at the nearest pickup point. A shuttle driver should meet you within 30 minutes.
    
    If you are driving to the event:
    
    •	Self-parking charges will be covered by JLR at the event site.
    
    HOTEL AND LODGING
    
    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night prior to your training wave.
    
    The Land Rover events team will book your hotel room on your behalf at Doubletree by Hilton DFW North for the night of ${hotelDate}. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon check-in.
    
    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own expense.
    
    Breakfast & registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30 a.m.
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the training.
    
    PLEASE NOTE THE FOLLOWING
    
    •	Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your own.
    •	Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.    
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in Irving,&nbsp;Texas!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Doubletree by Hilton DFW North</strong><br>
    4441 W John Carpenter Freeway<br>
    Irving, TX 75063<br><br>

    <strong>TRAVEL &amp; GROUND TRANSPORTATION</strong><br><br>

    <strong>If you are <em>flying</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Please know that you will be responsible for your flight&nbsp;cost.</li>
      <li style="Margin:0;">If you need to fly to the event, please fly to DFW airport due to the location of the&nbsp;training.
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave&nbsp;date.</li>
          <li style="Margin:0;">When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:30 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and&nbsp;boarding.</li>
        </ul>
      </li>
      <li style="Margin:0;"><strong>Doubletree by Hilton DFW North</strong> offers complimentary shuttle transportation to and from DFW airport. (We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own&nbsp;expense.)
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">Shuttle Instructions: Shuttle Instructions: Once you have landed and retrieved your bag from baggage claim, call <a href="tel:(972)929-8181" style="color:#0c121c;">(972)&nbsp;929&#8209;8181</a> to have the hotel shuttle pick you up at the nearest pickup point. A shuttle driver should meet you within 30&nbsp;minutes.</li>
        </ul>
      </li>
    </ul><br>

    <strong>If you are <em>driving</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Self-parking charges will be covered by JLR at the event&nbsp;site.</li>
    </ul><br>

    <strong>HOTEL AND LODGING</strong><br><br>

    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night <em>prior</em> to your training&nbsp;wave.<br><br>

    The Land Rover events team will book your hotel room on your behalf at <strong>Doubletree by Hilton DFW North</strong> for the night of <strong>${hotelDate}</strong>. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon&nbsp;check-in.<br><br>

    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own&nbsp;expense.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30&nbsp;a.m.<br><br>
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the&nbsp;training.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your&nbsp;own.</li>
      <li style="Margin:0;">Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Irving, TX') !== -1 && !data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Irving, Texas! 

    Training Venue:
    Doubletree by Hilton DFW North
    4441 W John Carpenter Freeway
    Irving, TX 75063

    TRAVELING TO THE EVENT

    Due to your retailer’s proximity to the training location, a hotel room has not been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at (972) 929-8181 to check availability.

    Breakfast & registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign in.

    Self-parking charges for your vehicle will be covered by JLR at the training location.

    PLEASE NOTE THE FOLLOWING

    •	Breakfast, lunch, and refreshments will be provided on your event day.
    •	Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in Irving,&nbsp;Texas!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Doubletree by Hilton DFW North</strong><br>
    4441 W John Carpenter Freeway<br>
    Irving, TX 75063<br><br>

    <strong>TRAVELING TO THE EVENT</strong><br><br>

    Due to your retailer’s proximity to the training location, a hotel room has <strong>not</strong> been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at <a href="tel:(972)929-8181" style="color:#0c121c;">(972)&nbsp;929&#8209;8181</a> to check&nbsp;availability.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign&nbsp;in.<br><br>
    
    Self-parking charges for your vehicle will be covered by JLR at the training&nbsp;location.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event&nbsp;day.</li>
      <li style="Margin:0;">Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Rosemont, IL') !== -1 && data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Chicago!

    Training Venue:
    Sheraton Suites O’Hare Airport 
    6501 Mannheim Rd
    Rosemont, IL 60018

    TRAVEL & GROUND TRANSPORTATION

    If you are flying to the event:

    •	Please know that you will be responsible for your flight cost.
    •	If you need to fly to the event, please fly to ORD airport due to the location of the training.
        o	When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave date.
        o	When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:30 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and boarding.
    •	Sheraton Suites O’Hare Airport offers complimentary shuttle transportation to and from ORD airport. We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own expense.
        o	Shuttle Instructions: To access the complimentary hotel shuttle, you will need to walk to the shuttle bus center after you retrieve your luggage from baggage claim.
            	From Terminals 1, 2 and 3: look for the red and blue arrows on the floor at the baggage claim level. Look also for the red and blue sign overhead which reads “Bus Shuttle Center.”
            	Follow the signs which will lead to an escalator. Take the escalator down one level. 
            	Continue to follow the signs, which will lead to elevator banks #3 and/or #4. Take either set of elevators up one level.
            	Proceed into Bus Shuttle Center and wait at door #3. (NOTE: When standing at door #3, you will be standing across the street from the Hilton hotel.)

    
    If you are driving to the event:
    
    •	Self-parking charges will be covered by JLR at the event site.
    
    HOTEL AND LODGING
    
    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night prior to your training wave.
    
    The Land Rover events team will book your hotel room on your behalf at Sheraton Suites O’Hare Airport for the night of ${hotelDate}. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon check-in.
    
    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own expense.
    
    Breakfast & registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30 a.m.
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the training.
    
    PLEASE NOTE THE FOLLOWING
    
    •	Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your own.
    •	Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.    
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in&nbsp;Chicago!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Sheraton Suites O’Hare Airport</strong><br>
    6501 Mannheim Rd<br>
    Rosemont, IL 60018<br><br>

    <strong>TRAVEL &amp; GROUND TRANSPORTATION</strong><br><br>

    <strong>If you are <em>flying</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Please know that you will be responsible for your flight&nbsp;cost.</li>
      <li style="Margin:0;">If you need to fly to the event, please fly to ORD airport due to the location of the&nbsp;training.
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave&nbsp;date.</li>
          <li style="Margin:0;">When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:30 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and&nbsp;boarding.</li>
        </ul>
      </li>
      <li style="Margin:0;"><strong>Sheraton Suites O’Hare Airport</strong> offers complimentary shuttle transportation to and from ORD airport. We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own&nbsp;expense.
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">Shuttle Instructions: To access the complimentary hotel shuttle, you will need to walk to the shuttle bus center after you retrieve your luggage from baggage&nbsp;claim.
            <ul style="padding: 0; Margin: 0 0 0 25px;">
              <li style="Margin:0;">From Terminals 1, 2 and 3: look for the red and blue arrows on the floor at the baggage claim level. Look also for the red and blue sign overhead which reads “Bus Shuttle&nbsp;Center.”</li>
              <li style="Margin:0;">Follow the signs which will lead to an escalator. Take the escalator down one&nbsp;level.</li>
              <li style="Margin:0;">Continue to follow the signs, which will lead to elevator banks #3 and/or #4. Take either set of elevators up one&nbsp;level.</li>
              <li style="Margin:0;">Proceed into Bus Shuttle Center and wait at door #3. (NOTE: When standing at door #3, you will be standing across the street from the Hilton&nbsp;hotel.)</li>
            </ul>
          </li>
        </ul>
      </li>
    </ul><br>

    <strong>If you are <em>driving</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Self-parking charges will be covered by JLR at the event&nbsp;site.</li>
    </ul><br>

    <strong>HOTEL AND LODGING</strong><br><br>

    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night <em>prior</em> to your training&nbsp;wave.<br><br>

    The Land Rover events team will book your hotel room on your behalf at <strong>Sheraton Suites O’Hare Airport</strong> for the night of <strong>${hotelDate}</strong>. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon&nbsp;check-in.<br><br>

    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own&nbsp;expense.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30&nbsp;a.m.<br><br>
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the&nbsp;training.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your&nbsp;own.</li>
      <li style="Margin:0;">Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Rosemont, IL') !== -1 && !data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Chicago! 

    Training Venue:
    Sheraton Suites O’Hare Airport 
    6501 Mannheim Rd
    Rosemont, IL 60018

    TRAVELING TO THE EVENT

    Due to your retailer’s proximity to the training location, a hotel room has not been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at (847) 699-6300 to check availability.

    Breakfast & registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign in.

    Self-parking charges for your vehicle will be covered by JLR at the training location.

    PLEASE NOTE THE FOLLOWING

    •	Breakfast, lunch, and refreshments will be provided on your event day.
    •	Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in&nbsp;Chicago!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Sheraton Suites O’Hare Airport</strong><br>
    6501 Mannheim Rd<br>
    Rosemont, IL 60018<br><br>

    <strong>TRAVELING TO THE EVENT</strong><br><br>

    Due to your retailer’s proximity to the training location, a hotel room has <strong>not</strong> been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at <a href="tel:(847)699-6300" style="color:#0c121c;">(847)&nbsp;699&#8209;6300</a> to check&nbsp;availability.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign&nbsp;in.<br><br>
    
    Self-parking charges for your vehicle will be covered by JLR at the training&nbsp;location.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event&nbsp;day.</li>
      <li style="Margin:0;">Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Santa Ana, CA') !== -1 && data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Orange County, California!

    Training Venue:
    Doubletree by Hilton Santa Ana – Orange County Airport 
    201 East MacArthur Blvd. 
    Santa Ana, CA 92707

    TRAVEL & GROUND TRANSPORTATION

    If you are flying to the event:

    •	Please know that you will be responsible for your flight cost.
    •	You should plan to fly into Orange County Airport (SNA) due to the location of the training.
        o	When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave date.
        o	When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:00 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and boarding.
    •	Doubletree by Hilton Santa Ana – Orange County Airport offers complimentary shuttle transportation to and from SNA airport. (We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own expense.)
        o	Shuttle Instructions: Complimentary shuttle transportation is offered between 5:30 am and 11:00 pm. When you land and have collected your luggage from baggage claim, please call (714) 825-3333 to let the hotel know you are awaiting pickup. Follow the signs to Ground Transportation (specifically you will need to go to the area labeled Courtesy Shuttles) and this is where you will meet your shuttle.

    
    If you are driving to the event:
    
    •	Self-parking charges will be covered by JLR at the event site.
    
    HOTEL AND LODGING
    
    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night prior to your training wave.
    
    The Land Rover events team will book your hotel room on your behalf at Doubletree by Hilton Santa Ana – Orange County Airport for the night of ${hotelDate}. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon check-in.
    
    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own expense.
    
    Breakfast & registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30 a.m.
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the training.
    
    PLEASE NOTE THE FOLLOWING
    
    •	Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your own.
    •	Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.    
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in Orange County,&nbsp;California!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Doubletree by Hilton Santa Ana &ndash; Orange County Airport</strong><br>
    201 East MacArthur Blvd.<br>
    Santa Ana, CA 92707<br><br>

    <strong>TRAVEL &amp; GROUND TRANSPORTATION</strong><br><br>

    <strong>If you are <em>flying</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Please know that you will be responsible for your flight&nbsp;cost.</li>
      <li style="Margin:0;">You should plan to fly into Orange County Airport (SNA) due to the location of the&nbsp;training.
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave&nbsp;date.</li>
          <li style="Margin:0;">When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:00 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and&nbsp;boarding.</li>
        </ul>
      </li>
      <li style="Margin:0;"><strong>Doubletree by Hilton Santa Ana &ndash; Orange County Airport</strong> offers complimentary shuttle transportation to and from SNA airport. (We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own&nbsp;expense.)
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">Shuttle Instructions: Complimentary shuttle transportation is offered between 5:30 am and 11:00 pm. When you land and have collected your luggage from baggage claim, please call <a href="tel:(714)825-3333" style="color:#0c121c;">(714)&nbsp;825&#8209;3333</a> to let the hotel know you are awaiting pickup. Follow the signs to Ground Transportation (specifically you will need to go to the area labeled Courtesy Shuttles) and this is where you will meet your&nbsp;shuttle.</li>
        </ul>
      </li>
    </ul><br>

    <strong>If you are <em>driving</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Self-parking charges will be covered by JLR at the event&nbsp;site.</li>
    </ul><br>

    <strong>HOTEL AND LODGING</strong><br><br>

    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night <em>prior</em> to your training&nbsp;wave.<br><br>

    The Land Rover events team will book your hotel room on your behalf at <strong>Doubletree by Hilton Santa Ana &ndash; Orange County Airport</strong> for the night of <strong>${hotelDate}</strong>. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon&nbsp;check-in.<br><br>

    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own&nbsp;expense.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30&nbsp;a.m.<br><br>
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the&nbsp;training.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your&nbsp;own.</li>
      <li style="Margin:0;">Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Santa Ana, CA') !== -1 && !data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Orange County, California! 

    Training Venue:
    Doubletree by Hilton Santa Ana – Orange County Airport 
    201 East MacArthur Blvd. 
    Santa Ana, CA 92707

    TRAVELING TO THE EVENT

    Due to your retailer’s proximity to the training location, a hotel room has not been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at (714) 825-3333 to check availability.

    Breakfast & registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign in.

    Self-parking charges for your vehicle will be covered by JLR at the training location.

    PLEASE NOTE THE FOLLOWING

    •	Breakfast, lunch, and refreshments will be provided on your event day.
    •	Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in Orange County,&nbsp;California!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Doubletree by Hilton Santa Ana &ndash; Orange County Airport</strong><br>
    201 East MacArthur Blvd.<br>
    Santa Ana, CA 92707<br><br>

    <strong>TRAVELING TO THE EVENT</strong><br><br>

    Due to your retailer’s proximity to the training location, a hotel room has <strong>not</strong> been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at <a href="tel:(714)825-3333" style="color:#0c121c;">(714)&nbsp;825&#8209;3333</a> to check&nbsp;availability.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign&nbsp;in.<br><br>
    
    Self-parking charges for your vehicle will be covered by JLR at the training&nbsp;location.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event&nbsp;day.</li>
      <li style="Margin:0;">Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Oakland, CA') !== -1 && data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Oakland, California!

    Training Venue:
    Hilton Oakland Airport
    1 Hegenberger Rd
    Oakland, CA 94621

    TRAVEL & GROUND TRANSPORTATION

    If you are flying to the event:

    •	Please know that you will be responsible for your flight cost.
    •	You should plan to fly into Oakland airport (OAK) due to the location of the training.
        o	When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave date.
        o	When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:00 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and boarding.
    •	Hilton Oakland Airport offers complimentary shuttle transportation to and from OAK airport. (We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own expense.)
        o	Shuttle Instructions: Upon deplaning and collecting your baggage, follow the signs to the Hotel Shuttles area. You will need to be standing at the 4B or 4G area specifically and look for the Hilton shuttle van. Shuttles cycle approximately every 20 minutes, but if you have any questions you may contact the hotel at (510) 635-5000 to confirm the next available pick-up time.

    
    If you are driving to the event:
    
    •	Self-parking charges will be covered by JLR at the event site.
    
    HOTEL AND LODGING
    
    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night prior to your training wave.
    
    The Land Rover events team will book your hotel room on your behalf at Hilton Oakland Airport for the night of ${hotelDate}. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon check-in.
    
    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own expense.
    
    Breakfast & registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30 a.m.
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the training.
    
    PLEASE NOTE THE FOLLOWING
    
    •	Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your own.
    •	Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.    
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in Oakland,&nbsp;California!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Hilton Oakland Airport</strong><br>
    1 Hegenberger Rd<br>
    Oakland, CA 94621<br><br>

    <strong>TRAVEL &amp; GROUND TRANSPORTATION</strong><br><br>

    <strong>If you are <em>flying</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Please know that you will be responsible for your flight&nbsp;cost.</li>
      <li style="Margin:0;">You should plan to fly into Oakland airport (OAK) due to the location of the&nbsp;training.
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave&nbsp;date.</li>
          <li style="Margin:0;">When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:00 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and&nbsp;boarding.</li>
        </ul>
      </li>
      <li style="Margin:0;"><strong>Hilton Oakland Airport</strong> offers complimentary shuttle transportation to and from OAK airport. (We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own&nbsp;expense.)
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">Shuttle Instructions: Upon deplaning and collecting your baggage, follow the signs to the Hotel Shuttles area. You will need to be standing at the <strong>4B</strong> or <strong>4G</strong> area specifically and look for the Hilton shuttle van. Shuttles cycle approximately every 20 minutes, but if you have any questions you may contact the hotel at <a href="tel:(510)635-5000" style="color:#0c121c;">(510)&nbsp;635&#8209;5000</a> to confirm the next available pick&#8209;up&nbsp;time.</li>
        </ul>
      </li>
    </ul><br>

    <strong>If you are <em>driving</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Self-parking charges will be covered by JLR at the event&nbsp;site.</li>
    </ul><br>

    <strong>HOTEL AND LODGING</strong><br><br>

    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night <em>prior</em> to your training&nbsp;wave.<br><br>

    The Land Rover events team will book your hotel room on your behalf at <strong>Hilton Oakland Airport</strong> for the night of <strong>${hotelDate}</strong>. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon&nbsp;check-in.<br><br>

    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own&nbsp;expense.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30&nbsp;a.m.<br><br>
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the&nbsp;training.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your&nbsp;own.</li>
      <li style="Margin:0;">Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Oakland, CA') !== -1 && !data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Oakland, California! 

    Training Venue:
    Hilton Oakland Airport
    1 Hegenberger Rd
    Oakland, CA 94621

    TRAVELING TO THE EVENT

    Due to your retailer’s proximity to the training location, a hotel room has not been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at (510) 635-5000 to check availability.

    Breakfast & registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign in.

    Self-parking charges for your vehicle will be covered by JLR at the training location.

    PLEASE NOTE THE FOLLOWING

    •	Breakfast, lunch, and refreshments will be provided on your event day.
    •	Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in Oakland,&nbsp;California!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Hilton Oakland Airport</strong><br>
    1 Hegenberger Rd<br>
    Oakland, CA 94621<br><br>

    <strong>TRAVELING TO THE EVENT</strong><br><br>

    Due to your retailer’s proximity to the training location, a hotel room has <strong>not</strong> been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at <a href="tel:(510)635-5000" style="color:#0c121c;">(510)&nbsp;635&#8209;5000</a> to check&nbsp;availability.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign&nbsp;in.<br><br>
    
    Self-parking charges for your vehicle will be covered by JLR at the training&nbsp;location.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event&nbsp;day.</li>
      <li style="Margin:0;">Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Mahwah, NJ') !== -1 && data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Mahwah, New Jersey!

    Training Venue:
    Jaguar Land Rover North American Headquarters
    100 Jaguar Land Rover Way
    Mahwah, NJ 07495

    TRAVEL & GROUND TRANSPORTATION

    •	If you fly to the event, we recommend flying to EWR airport due to its proximity to the training location. You will be responsible for your flight cost and for procuring ground transportation from your arrival airport to the Sheraton Mahwah Hotel.
        o	When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave date.
        o	When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 8:30 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and boarding.
    •	If you plan to drive to the event, you will be able to park at the Sheraton Mahwah (complimentary) and be shuttled to JLR North America for the training activities.
    
    HOTEL AND LODGING
    
    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night prior to your training wave.

    The host hotel is: 
    Sheraton Mahwah
    Route 17 North, 1 International Blvd
    Mahwah, NJ 07495
    
    You do not need to call the hotel to book your room. The Land Rover events team will book your hotel room on your behalf at the Sheraton Mahwah for the night of ${hotelDate}. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon check-in.

    Shuttle transportation will be provided to you between the hotel and the event site on the day of your training wave. Shuttle transportation will depart the Sheraton Mahwah for JLR North American Headquarters promptly at 7:40 a.m. on the morning of your training. Please check out of your hotel room prior to boarding the shuttle and bring your luggage with you.
    
    You will have the option of riding the event shuttle to Newark Liberty International Airport (EWR) immediately following your training wave.
    
    PLEASE NOTE THE FOLLOWING
    
    •	Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your own.
    •	Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.    
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in Mahwah, New&nbsp;Jersey!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Jaguar Land Rover North American Headquarters</strong><br>
    100 Jaguar Land Rover Way<br>
    Mahwah, NJ 07495<br><br>

    <strong>TRAVEL &amp; GROUND TRANSPORTATION</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">If you <em>fly</em> to the event, we recommend flying to EWR airport due to its proximity to the training location. You will be responsible for your flight cost and for procuring ground transportation from your arrival airport to the Sheraton Mahwah&nbsp;Hotel.
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave&nbsp;date.</li>
          <li style="Margin:0;">When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 8:30 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and&nbsp;boarding.</li>
        </ul>
      </li>
      <li style="Margin:0;">If you plan to <em>drive</em> to the event, you will be able to park at the Sheraton Mahwah (complimentary) and be shuttled to JLR North America for the training&nbsp;activities.</li>
    </ul><br>

    <strong>If you are <em>driving</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Self-parking charges will be covered by JLR at the event&nbsp;site.</li>
    </ul><br>

    <strong>HOTEL AND LODGING</strong><br><br>

    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night <em>prior</em> to your training&nbsp;wave.<br><br>

    The host hotel is:<br>
    <strong>Sheraton Mahwah</strong><br>
    Route 17 North, 1 International Blvd<br>
    Mahwah, NJ 07495<br><br>
    
    You do not need to call the hotel to book your room. The Land Rover events team will book your hotel room on your behalf at the <strong>Sheraton Mahwah</strong> for the night of <strong>${hotelDate}</strong>. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon check-in.<br><br>

    Shuttle transportation will be provided to you <em>between the hotel and the event site</em> on the day of your training wave. Shuttle transportation will depart the Sheraton Mahwah for JLR North American Headquarters promptly at 7:40 a.m. on the morning of your training. Please check out of your hotel room prior to boarding the shuttle and bring your luggage with&nbsp;you.<br><br>

    You will have the option of riding the event shuttle to Newark Liberty International Airport (EWR) immediately following your training&nbsp;wave.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your&nbsp;own.</li>
      <li style="Margin:0;">Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Mahwah, NJ') !== -1 && !data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Mahwah, New Jersey! 

    Training Venue:
    Jaguar Land Rover North American Headquarters
    100 Jaguar Land Rover Way
    Mahwah, NJ 07495

    TRAVELING TO THE EVENT

    Due to your retailer’s proximity to the training location, a hotel room has not been procured for you. Should you desire to book a hotel room in the area, you may do so at your own expense (the Sheraton Mahwah is the closest hotel and may be reached at (201) 529-1660.

    Breakfast & registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign in.

    PLEASE NOTE THE FOLLOWING

    •	Breakfast, lunch, and refreshments will be provided on your event day.
    •	Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in Mahwah, New&nbsp;Jersey!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Jaguar Land Rover North American Headquarters</strong><br>
    100 Jaguar Land Rover Way<br>
    Mahwah, NJ 07495<br><br>

    <strong>TRAVELING TO THE EVENT</strong><br><br>

    Due to your retailer’s proximity to the training location, a hotel room has <strong>not</strong> been procured for you. Should you desire to book a hotel room in the area, you may do so at your own expense (the Sheraton Mahwah is the closest hotel and may be reached at <a href="tel:(201)529-1660" style="color:#0c121c;">(201)&nbsp;529&#8209;1660</a>.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign&nbsp;in.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event&nbsp;day.</li>
      <li style="Margin:0;">Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Toronto, ON') !== -1 && data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Toronto!

    Training Venue:
    Hilton Garden Inn Toronto Airport
    3311 Caroga Dr
    Mississauga, ON L4V 1A3, Canada

    TRAVEL & GROUND TRANSPORTATION

    If you are flying to the event:

    •	Please know that you will be responsible for your flight cost.
    •	Please fly to Toronto Pearson (YYZ) airport due to the training location.
        o	When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave date.
        o	When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:30 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and boarding.
    •	Hilton Garden Inn Toronto Airport offers complimentary shuttle transportation to and from YYZ airport. We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own expense.
        o	Shuttle Instructions:
            	From Terminal 1, lower level: go to Post S5 and P3 and board Hilton Garden Inn Toronto Airport complimentary shuttle to hotel.
            	From Terminal 3, the pick-up location is Inner Curb, Post 35-43.
            	Should you have any questions you may call the hotel at (905) 678-0041.

    
    If you are driving to the event:
    
    •	Self-parking charges will be covered by JLR at the event site. Underground parking is available.
    
    HOTEL AND LODGING
    
    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night prior to your training wave.
    
    The Land Rover events team will book your hotel room on your behalf at Hilton Garden Inn Toronto Airport for the night of ${hotelDate}. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon check-in.
    
    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own expense.
    
    Breakfast & registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30 a.m.
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the training.
    
    PLEASE NOTE THE FOLLOWING
    
    •	Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your own.
    •	Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.    
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in&nbsp;Toronto!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Hilton Garden Inn Toronto Airport</strong><br>
    3311 Caroga Dr<br>
    Mississauga, ON L4V 1A3, Canada<br><br>

    <strong>TRAVEL &amp; GROUND TRANSPORTATION</strong><br><br>

    <strong>If you are <em>flying</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Please know that you will be responsible for your flight&nbsp;cost.</li>
      <li style="Margin:0;">Please fly to Toronto Pearson (YYZ) airport due to the training&nbsp;location.
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">When scheduling your flight to the event, you may fly in anytime the day/night prior to your wave&nbsp;date.</li>
          <li style="Margin:0;">When scheduling your return flight, please note that you must attend the entire event in order to earn credit. Anyone who departs the event early will not get credit. The event concludes at 5:00 p.m. Based on the event location, we recommend scheduling a departure flight no earlier than 7:30 p.m. to allow ample time for travel to the airport, check-in, bag check, security, and&nbsp;boarding.</li>
        </ul>
      </li>
      <li style="Margin:0;"><strong>Hilton Garden Inn Toronto Airport</strong> offers complimentary shuttle transportation to and from YYZ airport. We recommend using the shuttle versus renting a car. If you choose to rent a car, it will be at your own&nbsp;expense.
        <ul style="padding: 0; Margin: 0 0 0 25px;">
          <li style="Margin:0;">Shuttle Instructions:
            <ul style="padding: 0; Margin: 0 0 0 25px;">
              <li style="Margin:0;">From Terminal 1, lower level: go to Post S5 and P3 and board <strong>Hilton Garden Inn Toronto Airport</strong> complimentary shuttle to&nbsp;hotel.</li>
              <li style="Margin:0;">From Terminal 3, the pick-up location is Inner Curb, Post&nbsp;35&#8209;43.</li>
              <li style="Margin:0;">Should you have any questions you may call the hotel at <a href="tel:(905)678-0041" style="color:#0c121c;">(905)&nbsp;678&#8209;0041</a>.</li>
            </ul>
          </li>
        </ul>
      </li>
    </ul><br>

    <strong>If you are <em>driving</em> to the event:</strong><br><br>

    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Self-parking charges will be covered by JLR at the event site. Underground parking is&nbsp;available.</li>
    </ul><br>

    <strong>HOTEL AND LODGING</strong><br><br>

    Due to your retailer’s distance from the training location, a hotel room has been procured for you for the night <em>prior</em> to your training&nbsp;wave.<br><br>

    The Land Rover events team will book your hotel room on your behalf at <strong>Hilton Garden Inn Toronto Airport</strong> for the night of <strong>${hotelDate}</strong>. The room will be paid for by JLR, but you will need to provide a credit card for incidentals upon&nbsp;check-in.<br><br>

    Should you need a hotel room for additional nights due to travel time/constraints, any additional hotel nights will need to be booked on your own and will be at your own&nbsp;expense.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. on your wave date in the hotel meeting space. The opening session will begin promptly at 8:30&nbsp;a.m.<br><br>
    
    Please check out of your hotel room prior to breakfast/registration, as you will not have time during the day to go back to your room and check out. We recommend checking any luggage with the hotel bell desk for storage during the day while you are at the&nbsp;training.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event day, but any dinners will be on your&nbsp;own.</li>
      <li style="Margin:0;">Please remember to bring a credit or debit card and your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  } else if (data.wave.indexOf('Toronto, ON') !== -1 && !data.hotel) {
    waveTextInfo = `
    Thank you for registering for the New Range Rover Evoque North American Launch Training!

    You have successfully registered for the training which will take place on ${waveDate}, in Toronto! 

    Training Venue:
    Hilton Garden Inn Toronto Airport
    3311 Caroga Dr
    Mississauga, ON L4V 1A3, Canada

    TRAVELING TO THE EVENT

    Due to your retailer’s proximity to the training location, a hotel room has not been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at (905) 678-0041 to check availability.

    Breakfast & registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign in.

    Self-parking charges for your vehicle will be covered by JLR at the training location. Underground parking is available.

    PLEASE NOTE THE FOLLOWING

    •	Breakfast, lunch, and refreshments will be provided on your event day.
    •	Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the event.)
    •	Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels are not appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the climate.
    `;

    waveHtmlInfo = `
    <strong>Thank you for registering for the</strong> New Range Rover Evoque North American Launch&nbsp;Training!<br><br>

    You have successfully registered for the training which will take place on <strong>${waveDate}</strong>, in&nbsp;Toronto!<br><br>

    <strong>Training Venue:</strong><br>
    <strong>Hilton Garden Inn Toronto Airport</strong><br>
    3311 Caroga Dr<br>
    Mississauga, ON L4V 1A3, Canada<br><br>

    <strong>TRAVELING TO THE EVENT</strong><br><br>

    Due to your retailer’s proximity to the training location, a hotel room has <strong>not</strong> been procured for you. Should you desire to book a hotel room at your own expense, you may contact the hotel at <a href="tel:(905)678-0041" style="color:#0c121c;">(905)&nbsp;678&#8209;0041</a> to check&nbsp;availability.<br><br>
    
    Breakfast &amp; registration open at 7:30 a.m. at the training location on your wave date. The opening session will begin promptly at 8:30 a.m., so please arrive no later than 8:00 a.m. in order to ensure time to sign&nbsp;in.<br><br>
    
    Self-parking charges for your vehicle will be covered by JLR at the training location. Underground parking is&nbsp;available.<br><br>
    
    <strong>PLEASE NOTE THE FOLLOWING</strong><br><br>
    
    <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Breakfast, lunch, and refreshments will be provided on your event&nbsp;day.</li>
      <li style="Margin:0;">Please remember to bring your driver’s license. (You must be 21 years of age or older to drive at the&nbsp;event.)</li>
      <li style="Margin:0;">Please plan to wear a collared shirt and shoes appropriate for driving. Please note, sandals and heels <strong><em>are not</em></strong> appropriate for this event. Jeans are okay, provided they are not torn and do not have holes. Although the majority of your time will be spent either indoors or inside a vehicle, the weather in some training locations may be fickle. Therefore, we recommend bringing warm clothing in case of cold, wind, or rain. Please consider the time of year and the&nbsp;climate.</li>
    </ul><br>
    `;
  };

  const textContent = `
    ${waveTextInfo}

    QUESTIONS?

    If after registering you have questions, please consult our Frequently Asked Questions page, contact the JLR Event Support Team at info@landroverlaunches.com or call our toll-free helpline at (856) 351-5378.

    If you need to cancel your registration, please contact the JLR Event Support Team using the information above and please note the cancellation fee policy is as follows:

    •	7-14 days prior to event: $1,500
    •	0-7 days prior to event: $3,000
    •	No Shows will be charged: $3,000

    We look forward to seeing you at the New Range Rover Evoque North American Launch Training!

    Sincerely,

    The JLR Event Support Team
  `;

  const htmlContent = `
    <div id="email">
      <link rel="stylesheet" href="https://s3-us-west-1.amazonaws.com/landroverlaunches.com/css/fonts.css">
      <link rel="stylesheet" href="https://s3-us-west-1.amazonaws.com/landroverlaunches.com/css/email-reset.css">
      <div style="margin:30px auto; max-width:768px; min-width:290px; text-align:center; width:90%;">
        <div style="color:#0c121c; font-family:'Avenir LT Std', Arial, Helvetica, sans-serif; font-weight:400; margin:45px auto 60px; min-height:200px; min-width:200px; text-align:left; width:80%;">
          <span style="font-size:14px; line-height:1.4;">
            ${waveHtmlInfo}

            <strong>QUESTIONS?</strong><br><br>

            If after registering you have questions, please consult our <a href="https://landroverlaunches.com/faqs" style="color:#0c121c;">Frequently Asked Questions</a> page, contact the JLR Event Support Team at <a href="mailto:info@landroverlaunches.com" style="color:#0c121c;">info@landroverlaunches.com</a> or call our toll-free helpline at <a href="tel:(856)351-5378" style="color:#0c121c;">(856)&nbsp;351&#8209;5378</a>.<br><br>

            If you need to cancel your registration, please contact the JLR Event Support Team using the information above and please note the cancellation fee policy is as follows:<br><br>

            <ul style="padding: 0; Margin: 0 0 0 25px;">
              <li style="Margin:0;">7-14 days prior to event: $1,500</li>
              <li style="Margin:0;">0-7 days prior to event: $3,000</li>
              <li style="Margin:0;">No Shows will be charged: $3,000</li>
            </ul><br>

            We look forward to seeing you at the New Range Rover Evoque North American Launch Training!<br><br>
    
            Sincerely,<br><br>

            The Land Rover Events&nbsp;Team
          </span>
        </div>
      </div>
    </div>
  `;

  // send to registrant
  const mailOptions = {
    from: '"JLR Event Support Team" <info@landroverlaunches.com>', // sender address
    to: data.email, // list of receivers
    subject: 'Your registration has been updated!', // Subject line
    text: textContent, // plaintext body
    html: htmlContent // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.status(500).send(error);
      // return console.log(error);
    } else {
      return res.status(250).send(info);
      // return console.log('Message sent: ', info.response);
    }
  });

  // send to admin
  const mailOptionsMsg = {
    from: '"JLR Event Support Team" <info@landroverlaunches.com>', // sender address
    to: '"JLR Event Support Team" <info@landroverlaunches.com>', // list of receivers
    replyTo: data.email, // list of replyTo's
    subject: 'Registration Updated for ' + data.first_name + ' ' + data.last_name, // Subject line
    text: textContent, // plaintext body
    html: htmlContent // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptionsMsg, function (error, info) {
    if (error) {
      return res.status(500).send(error);
      // return console.log(error);
    } else {
      return res.status(250).send(info);
      // return console.log('Message sent: ', info.response);
    }
  });
});


// deleted info emails
router.post('/deleted', function (req, res) {
  // get registrant data
  const data = req.body;

  const textContent = `
    Your registration has been removed from the New Range Rover Evoque North American Launch Training.

    Should you have any questions, please consult our Frequently Asked Questions page, contact the JLR Event Support Team at info@landroverlaunches.com or call our toll-free helpline at (856) 351-5378.

    Thank you,

    The JLR Event Support Team
  `;

  const htmlContent = `
    <div id="email">
      <link rel="stylesheet" href="https://s3-us-west-1.amazonaws.com/landroverlaunches.com/css/fonts.css">
      <link rel="stylesheet" href="https://s3-us-west-1.amazonaws.com/landroverlaunches.com/css/email-reset.css">
      <div style="margin:30px auto; max-width:768px; min-width:290px; text-align:center; width:90%;">
        <div style="color:#0c121c; font-family:'Avenir LT Std', Arial, Helvetica, sans-serif; font-weight:400; margin:45px auto 60px; min-height:200px; min-width:200px; text-align:left; width:80%;">
          <span style="font-size:14px; line-height:1.4;">
            Your registration has been removed from the New Range Rover Evoque North American Launch&nbsp;Training.<br><br>

            Should you have any questions, please consult our <a href="https://landroverlaunches.com/faqs" style="color:#0c121c;">Frequently Asked Questions</a> page, contact the JLR Event Support Team at <a href="mailto:info@landroverlaunches.com" style="color:#0c121c;">info@landroverlaunches.com</a> or call our toll-free helpline at <a href="tel:(856)351-5378" style="color:#0c121c;">(856)&nbsp;351&#8209;5378</a>.<br><br>

            Thank you,<br><br>

            The Land Rover Events&nbsp;Team
          </span>
        </div>
      </div>
    </div>
  `;

  // send to registrant
  const mailOptions = {
    from: '"JLR Event Support Team" <info@landroverlaunches.com>', // sender address
    to: data.email, // list of receivers
    subject: 'Your registration has been canceled', // Subject line
    text: textContent, // plaintext body
    html: htmlContent // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.status(500).send(error);
      // return console.log(error);
    } else {
      return res.status(250).send(info);
      // return console.log('Message sent: ', info.response);
    }
  });

  // send to admin
  const mailOptionsMsg = {
    from: '"JLR Event Support Team" <info@landroverlaunches.com>', // sender address
    to: '"JLR Event Support Team" <info@landroverlaunches.com>', // list of receivers
    replyTo: data.email, // list of replyTo's
    subject: 'Registration Removed for ' + data.first_name + ' ' + data.last_name, // Subject line
    text: textContent, // plaintext body
    html: htmlContent // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptionsMsg, function (error, info) {
    if (error) {
      return res.status(500).send(error);
      // return console.log(error);
    } else {
      return res.status(250).send(info);
      // return console.log('Message sent: ', info.response);
    }
  });
});

module.exports = router;
