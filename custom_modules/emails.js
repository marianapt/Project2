/*
  Accepts:

  userData = {
  firstName : "Bob",
  lastName : "Test",
  email : "bob@test.com"
  }

  eventData = null
    This will send a standard welcome email.

  OR:

  eventData = {
  eventName : "Bob's BBQ",
  date : "10/31/17",
  location : "30.286780, -97.727542",
  details : "This is a fun BBQ held at lot 40. Bring your buns!"
  }

*/
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'itsagoinfo@gmail.com',
        pass: "This is a totally secure password isn't it?"
        //TODO Change this to an environment variable
    }
});


module.exports = function(userData, eventData) {
  var options = {
   viewEngine: {
       extname: '.handlebars',
       layoutsDir: 'app/views/emailtemplates/',
       defaultLayout : 'welcome',
       partialsDir : 'app/views/partials/'
   },
   viewPath: 'app/views/emailtemplates/',
   extName: '.handlebars'
  };

  var newMail = {
    from: 'itsagoinfo@gmail.com', // sender address
    to: userData.email,           // user email
    subject: `${userData.firstname}, welcome to ItsAGo!`,    // Subject line
    template: 'welcome',
    context: userData
  };

  if (eventData !== null) {
    options.viewEngine.defaultLayout = 'invite';
    newMail.subject =  `${userData.name}, you've been invited to ${eventData.eventName}`;
    newMail.context = {userData, eventData}
  }

  transporter.use('compile', hbs(options));
  transporter.sendMail(newMail, function (err, info) {
     if(err) {
       console.log(err);
     }
     else {
       console.log(info) ;
     }
  });
}
