const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
service: 'gmail',
  auth: {
    user: "irelia5500@gmail.com",
    pass: "wblo bthn etfz zeae",
  },
});


const generateEmailContent = (name, status) => {
    let subject, text;
    if (status === 'accepted') {
        subject = 'Application Accepted';
        text = `Dear ${name},

We are pleased to inform you that your application has been accepted. Congratulations and welcome!

Best regards,
Shedi Lmaalem`;
    } else if (status === 'rejected') {
        subject = 'Application Rejected';
        text = `Dear ${name},

We regret to inform you that your application has been rejected. Thank you for your interest and we wish you the best in your future endeavors.

Best regards,
Shedi Lmaalem`;
    } else {
        throw new Error('Invalid application status');
    }
    return { subject, text };
};

// Create a function to send emails
const sendEmail = (email, name, status) => {

    const { subject, text } = generateEmailContent(name, status);
  let mailOptions = {
    from: '"Shedi Lmaalem" <irelia5500@gmail.com>',
    to: email,
    subject: subject,
    text: text,
    };
    transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
}
);
}

const sendResetPasswordEmail = (email, token) => {
    const subject = 'Reset Password';
    const text = `Use this link to reset your password: http://localhost:3000/reset-password/${token}`;
    let mailOptions = {
      from: '"Shedi Lmaalem" <irelia5500@gmail.com>',
      to: email,
      subject: subject,
      text: text,
      };
      transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Email sent successfully");
      }
  }
  );
}

const passwordChangedEmail = (email) => {
    const subject = 'Password Changed';
    const text = `Your password has been successfully changed. If you did not make this change, please contact us immediately.`;
    let mailOptions = {
      from: '"Shedi Lmaalem" <irelia5500@gmail.com>',
      to: email,
      subject: subject,
      text: text,
      };
      transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Email sent successfully");
      }
  }
  );
}

// Respond to Contact Us form submission
const RespondToContactUs = (name, email) => {
    const subject = 'Contact Us Form Submission';
    const text = `Dear ${name}, You have successfully submitted the Contact Us form. We will get back to you as soon as possible.`;
    let mailOptions = {
      from: '"Shedi Lmaalem" <irelia5500@gmail.com>',
      to: email,
      subject: subject,
      text: text,
      };
      transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Email sent successfully");
      }
  }
  );
}



// Generate test SMTP service account from ethereal.email
//sendEmail("yosraezzar3@gmail.com", "Test Email", "Hello World! From Shedi Lmaalem");

module.exports = { sendEmail, sendResetPasswordEmail, passwordChangedEmail, RespondToContactUs };