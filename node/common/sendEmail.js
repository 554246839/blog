let nodemailer = require('nodemailer')
let { EMAIL } = require('../config/default')

let smtpConfig = {
  host: EMAIL.HOST,
  port: EMAIL.PORT,
  // secure: true, // use SSL
  // service: EMAIL.SERVICE,
  secureConnection: true,
  auth: {
    user: EMAIL.FROM,
    pass: EMAIL.PASS
  }
};

let transporter = nodemailer.createTransport(smtpConfig);

module.exports = ({ to, subject, html, attachments }) => {
  var mailOptions = {
    from: `前端便利店<${EMAIL.FROM}>`,
    to,
    subject,
    html,
    attachments // 附件
    // [{ filename: 'package.json', path: './package.json' }, { filename: 'content', content: '发送内容' }]  
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error)
        return
      }
      resolve(info)
    });
  })
}

