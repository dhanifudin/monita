'use strict';

const adminId = process.env.ADMIN_ID;
const groupId = process.env.GROUP_ID;
const uptimeUrl = process.env.UPTIME_URL;

const axios = require('axios');
const CronJob = require('cron').CronJob;

const recipients = [].concat(adminId, groupId);
let currentStatus = 200;

function sendMessage(telegram, status) {
  if (currentStatus != status) {
    const message = (status == 200) ?
      `Server ${uptimeUrl} sehat kembali, status: ${status}` :
      `Server ${uptimeUrl} sedang bermasalah, status: ${status}`;
    recipients.forEach((recipient) => {
      (recipient) && telegram.sendMessage(recipient, message);
    });
  }
  currentStatus = status;
}

module.exports = (telegram) => {
  const job = new CronJob('0 */1 * * * *', () => {
    console.log(uptimeUrl);
    axios.head(uptimeUrl)
      .then(response => {
        const status = response.status;
        sendMessage(telegram, status);
      })
      .catch(err => {
        if (err.response) {
          const status = err.response.status;
          sendMessage(telegram, status);
        }
      });
  });

  job.start();
};