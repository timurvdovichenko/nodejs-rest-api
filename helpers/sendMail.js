const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const { MAILGUN_API_KEY } = process.env;
const mg = mailgun.client({
  username: 'api',
  key: MAILGUN_API_KEY,
});

const sendMail = async data => {
  try {
    const email = { ...data, from: 'timur.vdovichenko@gmail.com' };
    await mg.messages.create('sandbox725d2daa670c4055aa84757138648908.mailgun.org', email);
  } catch (error) {
    console.log('error :>> ', error);
  }
};
module.exports = sendMail;
