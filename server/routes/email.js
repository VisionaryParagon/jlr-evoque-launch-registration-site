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
    from: '"Land Rover Events Team" <info@landroverlaunches.com>', // sender address
    to: '"Land Rover Events Team" <info@landroverlaunches.com>', // list of receivers
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
    Thank you for contacting the New Range Rover Evoque Launch Tour helpline.

    We have received your inquiry and will respond within 24 hours.

    You may also visit the event website at landroverlaunches.com or call
    (800) 555-5555, Monday through Friday, 6 a.m.-6p.m. MST, for more information.

    Thank you,

    The Land Rover Events Team
  `;

  const htmlContentMsg2 = `
    <div id="email">
      <link rel="stylesheet" href="https://s3-us-west-1.amazonaws.com/landroverlaunches.com/css/fonts.css">
      <link rel="stylesheet" href="https://s3-us-west-1.amazonaws.com/landroverlaunches.com/css/email-reset.css">
      <div style="margin:30px auto; max-width:768px; min-width:290px; text-align:center; width:90%;">
        <div style="color:#0c121c; font-family:'Avenir LT Std', Arial, Helvetica, sans-serif; font-weight:400; margin:45px auto 60px; min-height:200px; min-width:200px; text-align:left; width:80%;">
          <span style="font-size:14px; line-height:1.4;">
          Thank you for contacting the New Range Rover Evoque Launch Tour&nbsp;helpline.<br><br>

          We have received your inquiry and will respond within 24&nbsp;hours.<br><br>

          You may also visit the event website at <a href="https://landroverlaunches.com" target="_blank">landroverlaunches.com</a> or call <a href="tel:(800)555-5555" style="color:#0c121c;">(800)&nbsp;555&#8209;5555</a>, Monday through Friday, 6&nbsp;a.m.&#8209;6&nbsp;p.m. MST, for more&nbsp;information.<br><br>

          Thank you,<br><br>

          The Land Rover Events Team
          </span>
        </div>
      </div>
    </div>
  `;

  const mailOptionsMsg2 = {
    from: '"Land Rover Events Team" <info@landroverlaunches.com>', // sender address
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
  let waveTextInfo = '';
  let waveHtmlInfo = '';

  if (data.wave === 'Wave 1 – March 20 (Reception March 20)') {
    waveTextInfo = `
      In addition to your March 20 event wave, all attendees are invited and highly encouraged to attend the Performance Leadership Summit Reception the evening of Tuesday, March 20. The Reception will include an exclusive Executive Leadership keynote address.

      You will need to arrive in Las Vegas by the evening of Monday, March 19. The event begins at Las Vegas Motor Speedway on Tuesday, March 20, with breakfast and registration beginning at 7:45 a.m.

      If you're planning to take advantage of the shuttle service we will be providing from the Las Vegas Strip to Las Vegas Motor Speedway, please note that transportation will be offered from the following hotels on the morning of March 20:

      Bellagio Las Vegas - departs at 7:10 a.m.
      The Mirage Las Vegas - departs at 7:10 a.m.

      A representative from our team will contact you a few weeks prior to the event to confirm your pickup location.

      Return transportation to the Las Vegas Strip will be provided at the conclusion of the day's track activities.

      The Performance Leadership Summit Reception will be held that evening (Tuesday, March 20), beginning at 6:00 p.m. It will be held at The Bank Nightclub at Bellagio. You may depart Las Vegas any time after the Performance Leadership Summit Reception.
    `;

    waveHtmlInfo = `
      In addition to your <strong>March 20</strong> event wave, <strong>all attendees are invited and highly encouraged to attend the Performance Leadership Summit Reception the evening of <span style="text-decoration: underline;">Tuesday, March 20</span>.</strong> The Reception will include an exclusive Executive Leadership keynote&nbsp;address.<br><br>

      You will need to arrive in Las Vegas by the evening of <strong>Monday, March 19.</strong> The event begins at Las Vegas Motor Speedway on <strong>Tuesday, March 20</strong>, with breakfast and registration beginning at 7:45&nbsp;a.m.<br><br>

      If you&rsquo;re planning to take advantage of the shuttle service we will be providing from the Las Vegas Strip to Las Vegas Motor Speedway, please note that transportation will be offered from the following hotels on the morning of March&nbsp;20:<br><br>

      <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Bellagio Las Vegas - departs at 7:10&nbsp;a.m.</li>
      <li style="Margin:0;">The Mirage Las Vegas - departs at 7:10&nbsp;a.m.</li>
      </ul><br>

      A representative from our team will contact you a few weeks prior to the event to confirm your pickup&nbsp;location.<br><br>

      Return transportation to the Las Vegas Strip will be provided at the conclusion of the day&rsquo;s track&nbsp;activities.<br><br>

      The Performance Leadership Summit Reception will be held that evening <strong>(Tuesday, March 20)</strong>, beginning at 6:00&nbsp;p.m. It will be held at The Bank Nightclub at Bellagio. You may depart Las Vegas any time after the Performance Leadership Summit&nbsp;Reception.<br><br>
    `;
  } else if (data.wave === 'Wave 2 – March 21 (Reception March 20)') {
    waveTextInfo = `
      In addition to your March 21 event wave, all attendees are invited and highly encouraged to attend the Performance Leadership Summit Reception the evening of Tuesday, March 20. The Reception will include an exclusive Executive Leadership keynote address.

      You will need to arrive in Las Vegas by 4:00 p.m. Tuesday, March 20. The event begins with the Performance Leadership Summit Reception Tuesday evening at The Bank Nightclub at Bellagio at 6:00 p.m.

      The track-based activities begin at Las Vegas Motor Speedway on Wednesday, March 21, with breakfast and registration beginning at 7:45 a.m.

      If you're planning to take advantage of the shuttle service we will be providing from the Las Vegas Strip to Las Vegas Motor Speedway, please note that transportation will be offered from the following hotels on the morning of March 21:

      Bellagio Las Vegas - departs at 7:10 a.m.
      The Mirage Las Vegas - departs at 7:10 a.m.

      A representative from our team will contact you a few weeks prior to the event to confirm your pickup location.

      Return transportation to the Las Vegas Strip, as well as a shuttle to the airport, will be provided at the conclusion of the day's track activities, around 4:00 p.m. You may depart Las Vegas the same evening if you choose. When booking your flight, please ensure you allow ample time to arrive and check in at the airport.
    `;

    waveHtmlInfo = `
      In addition to your <strong>March 21</strong> event wave, <strong>all attendees are invited and highly encouraged to attend the Performance Leadership Summit Reception the evening of <span style="text-decoration: underline;">Tuesday, March 20</span>.</strong> The Reception will include an exclusive Executive Leadership keynote&nbsp;address.<br><br>

      You will need to arrive in Las Vegas by <strong>4:00&nbsp;p.m. Tuesday, March 20.</strong> The event begins with the Performance Leadership Summit Reception Tuesday evening at The Bank Nightclub at Bellagio at 6:00&nbsp;p.m.<br><br>

      The track-based activities begin at Las Vegas Motor Speedway on Wednesday, March 21, with breakfast and registration beginning at 7:45&nbsp;a.m.<br><br>

      If you&rsquo;re planning to take advantage of the shuttle service we will be providing from the Las Vegas Strip to Las Vegas Motor Speedway, please note that transportation will be offered from the following hotels on the morning of March&nbsp;21:<br><br>

      <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Bellagio Las Vegas - departs at 7:10&nbsp;a.m.</li>
      <li style="Margin:0;">The Mirage Las Vegas - departs at 7:10&nbsp;a.m.</li>
      </ul><br>

      A representative from our team will contact you a few weeks prior to the event to confirm your pickup&nbsp;location.<br><br>

      Return transportation to the Las Vegas Strip, as well as a shuttle to the airport, will be provided at the conclusion of the day&rsquo;s track activities, around 4:00&nbsp;p.m. You may depart Las Vegas the same evening if you choose. When booking your flight, please ensure you allow ample time to arrive and check in at the&nbsp;airport.<br><br>
    `;
  };

  const textContent = `
    Dear ${data.first_name},

    Thank you for registering for the New Range Rover Evoque Launch Tour. Your attendance is confirmed!

    Should you have any questions, please reference our FAQ Page, contact the New Range Rover Evoque Launch Tour helpline at info@landroverlaunches.com or call us at (800) 555-5555, Monday through Friday, 6 a.m.-6 p.m. MST.

    Thank you,

    The Land Rover Events Team
  `;

  const htmlContent = `
    <div id="email">
      <link rel="stylesheet" href="https://s3-us-west-1.amazonaws.com/landroverlaunches.com/css/fonts.css">
      <link rel="stylesheet" href="https://s3-us-west-1.amazonaws.com/landroverlaunches.com/css/email-reset.css">
      <div style="margin:30px auto; max-width:768px; min-width:290px; text-align:center; width:90%;">
        <div style="color:#0c121c; font-family:'Avenir LT Std', Arial, Helvetica, sans-serif; font-weight:400; margin:45px auto 60px; min-height:200px; min-width:200px; text-align:left; width:80%;">
          <span style="font-size:14px; line-height:1.4;">
          Dear ${data.first_name},<br><br>

          Thank you for registering for the New Range Rover Evoque Launch Tour. Your attendance is&nbsp;confirmed!<br><br>

          Should you have any questions, please reference our <a href="https://landroverlaunches.com/faq" style="color:#0c121c;">FAQ Page</a>, contact the New Range Rover Evoque Launch Tour helpline at <a href="mailto:info@landroverlaunches.com" style="color:#0c121c;">info@landroverlaunches.com</a> or call us at <a href="tel:(800)555-5555" style="color:#0c121c;">(800)&nbsp;555&#8209;5555</a>, Monday through Friday, 6&nbsp;a.m.&#8209;6&nbsp;p.m.&nbsp;MST.<br><br>

          Thank you,<br><br>

          The Land Rover Events&nbsp;Team
          </span>
        </div>
      </div>
    </div>
  `;

  // send to registrant
  const mailOptions = {
    from: '"Land Rover Events Team" <info@landroverlaunches.com>', // sender address
    to: data.email, // list of receivers
    subject: 'Registration Confirmed for ' + data.first_name + ' ' + data.last_name, // Subject line
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
    from: '"Land Rover Events Team" <info@landroverlaunches.com>', // sender address
    to: '"Land Rover Events Team" <info@landroverlaunches.com>', // list of receivers
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
  let waveTextInfo = '';
  let waveHtmlInfo = '';

  if (data.wave === 'Wave 1 – March 20 (Reception March 20)') {
    waveTextInfo = `
      In addition to your March 20 event wave, all attendees are invited and highly encouraged to attend the Performance Leadership Summit Reception the evening of Tuesday, March 20. The Reception will include an exclusive Executive Leadership keynote address.

      You will need to arrive in Las Vegas by the evening of Monday, March 19. The event begins at Las Vegas Motor Speedway on Tuesday, March 20, with breakfast and registration beginning at 7:45 a.m.

      If you're planning to take advantage of the shuttle service we will be providing from the Las Vegas Strip to Las Vegas Motor Speedway, please note that transportation will be offered from the following hotels on the morning of March 20:

      Bellagio Las Vegas - departs at 7:10 a.m.
      The Mirage Las Vegas - departs at 7:10 a.m.

      A representative from our team will contact you a few weeks prior to the event to confirm your pickup location.

      Return transportation to the Las Vegas Strip will be provided at the conclusion of the day's track activities.

      The Performance Leadership Summit Reception will be held that evening (Tuesday, March 20), beginning at 6:00 p.m. It will be held at The Bank Nightclub at Bellagio. You may depart Las Vegas any time after the Performance Leadership Summit Reception.
    `;

    waveHtmlInfo = `
      In addition to your <strong>March 20</strong> event wave, <strong>all attendees are invited and highly encouraged to attend the Performance Leadership Summit Reception the evening of <span style="text-decoration: underline;">Tuesday, March 20</span>.</strong> The Reception will include an exclusive Executive Leadership keynote&nbsp;address.<br><br>

      You will need to arrive in Las Vegas by the evening of <strong>Monday, March 19.</strong> The event begins at Las Vegas Motor Speedway on <strong>Tuesday, March 20</strong>, with breakfast and registration beginning at 7:45&nbsp;a.m.<br><br>

      If you&rsquo;re planning to take advantage of the shuttle service we will be providing from the Las Vegas Strip to Las Vegas Motor Speedway, please note that transportation will be offered from the following hotels on the morning of March&nbsp;20:<br><br>

      <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Bellagio Las Vegas - departs at 7:10&nbsp;a.m.</li>
      <li style="Margin:0;">The Mirage Las Vegas - departs at 7:10&nbsp;a.m.</li>
      </ul><br>

      A representative from our team will contact you a few weeks prior to the event to confirm your pickup&nbsp;location.<br><br>

      Return transportation to the Las Vegas Strip will be provided at the conclusion of the day&rsquo;s track&nbsp;activities.<br><br>

      The Performance Leadership Summit Reception will be held that evening <strong>(Tuesday, March 20)</strong>, beginning at 6:00&nbsp;p.m. It will be held at The Bank Nightclub at Bellagio. You may depart Las Vegas any time after the Performance Leadership Summit&nbsp;Reception.<br><br>
    `;
  } else if (data.wave === 'Wave 2 – March 21 (Reception March 20)') {
    waveTextInfo = `
      In addition to your March 21 event wave, all attendees are invited and highly encouraged to attend the Performance Leadership Summit Reception the evening of Tuesday, March 20. The Reception will include an exclusive Executive Leadership keynote address.

      You will need to arrive in Las Vegas by 4:00 p.m. Tuesday, March 20. The event begins with the Performance Leadership Summit Reception Tuesday evening at The Bank Nightclub at Bellagio at 6:00 p.m.

      The track-based activities begin at Las Vegas Motor Speedway on Wednesday, March 21, with breakfast and registration beginning at 7:45 a.m.

      If you're planning to take advantage of the shuttle service we will be providing from the Las Vegas Strip to Las Vegas Motor Speedway, please note that transportation will be offered from the following hotels on the morning of March 21:

      Bellagio Las Vegas - departs at 7:10 a.m.
      The Mirage Las Vegas - departs at 7:10 a.m.

      A representative from our team will contact you a few weeks prior to the event to confirm your pickup location.

      Return transportation to the Las Vegas Strip, as well as a shuttle to the airport, will be provided at the conclusion of the day's track activities, around 4:00 p.m. You may depart Las Vegas the same evening if you choose. When booking your flight, please ensure you allow ample time to arrive and check in at the airport.
    `;

    waveHtmlInfo = `
      In addition to your <strong>March 21</strong> event wave, <strong>all attendees are invited and highly encouraged to attend the Performance Leadership Summit Reception the evening of <span style="text-decoration: underline;">Tuesday, March 20</span>.</strong> The Reception will include an exclusive Executive Leadership keynote&nbsp;address.<br><br>

      You will need to arrive in Las Vegas by <strong>4:00&nbsp;p.m. Tuesday, March 20.</strong> The event begins with the Performance Leadership Summit Reception Tuesday evening at The Bank Nightclub at Bellagio at 6:00&nbsp;p.m.<br><br>

      The track-based activities begin at Las Vegas Motor Speedway on Wednesday, March 21, with breakfast and registration beginning at 7:45&nbsp;a.m.<br><br>

      If you&rsquo;re planning to take advantage of the shuttle service we will be providing from the Las Vegas Strip to Las Vegas Motor Speedway, please note that transportation will be offered from the following hotels on the morning of March&nbsp;21:<br><br>

      <ul style="padding: 0; Margin: 0 0 0 25px;">
      <li style="Margin:0;">Bellagio Las Vegas - departs at 7:10&nbsp;a.m.</li>
      <li style="Margin:0;">The Mirage Las Vegas - departs at 7:10&nbsp;a.m.</li>
      </ul><br>

      A representative from our team will contact you a few weeks prior to the event to confirm your pickup&nbsp;location.<br><br>

      Return transportation to the Las Vegas Strip, as well as a shuttle to the airport, will be provided at the conclusion of the day&rsquo;s track activities, around 4:00&nbsp;p.m. You may depart Las Vegas the same evening if you choose. When booking your flight, please ensure you allow ample time to arrive and check in at the&nbsp;airport.<br><br>
    `;
  };

  const textContent = `
    Dear ${data.first_name},

    Your information has been updated for the New Range Rover Evoque Launch Tour. Your attendance is confirmed!

    Should you have any questions, please reference our FAQ Page, contact the New Range Rover Evoque Launch Tour helpline at info@landroverlaunches.com or call us at (800) 555-5555, Monday through Friday, 6 a.m.-6 p.m. MST.

    Thank you,

    The Land Rover Events Team
  `;

  const htmlContent = `
    <div id="email">
      <link rel="stylesheet" href="https://s3-us-west-1.amazonaws.com/landroverlaunches.com/css/fonts.css">
      <link rel="stylesheet" href="https://s3-us-west-1.amazonaws.com/landroverlaunches.com/css/email-reset.css">
      <div style="margin:30px auto; max-width:768px; min-width:290px; text-align:center; width:90%;">
        <div style="color:#0c121c; font-family:'Avenir LT Std', Arial, Helvetica, sans-serif; font-weight:400; margin:45px auto 60px; min-height:200px; min-width:200px; text-align:left; width:80%;">
          <span style="font-size:14px; line-height:1.4;">
          Dear ${data.first_name},<br><br>

          Your information has been updated for the New Range Rover Evoque Launch Tour. Your attendance is&nbsp;confirmed!<br><br>

          Should you have any questions, please reference our <a href="https://landroverlaunches.com/faq" style="color:#0c121c;">FAQ Page</a>, contact the New Range Rover Evoque Launch Tour helpline at <a href="mailto:info@landroverlaunches.com" style="color:#0c121c;">info@landroverlaunches.com</a> or call us at <a href="tel:(800)555-5555" style="color:#0c121c;">(800)&nbsp;555&#8209;5555</a>, Monday through Friday, 6&nbsp;a.m.&#8209;6&nbsp;p.m.&nbsp;MST.<br><br>

          Thank you,<br><br>

          The Land Rover Events&nbsp;Team
          </span>
        </div>
      </div>
    </div>
  `;

  // send to registrant
  const mailOptions = {
    from: '"Land Rover Events Team" <info@landroverlaunches.com>', // sender address
    to: data.email, // list of receivers
    subject: 'Registration Updated for ' + data.first_name + ' ' + data.last_name, // Subject line
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
    from: '"Land Rover Events Team" <info@landroverlaunches.com>', // sender address
    to: '"Land Rover Events Team" <info@landroverlaunches.com>', // list of receivers
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

module.exports = router;
