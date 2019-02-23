'use strict';

const uptimeUrl = process.env.UPTIME_URL;
const frequency = process.env.UPTIME_FREQUENCY;
const upMessage = process.env.UPTIME_UP_MESSAGE;
const downMessage = process.env.UPTIME_DOWN_MESSAGE;

const axios = require('axios');
const CronJob = require('cron').CronJob;
const helper = require('./helper');

const recipients = helper.getRecipients();

let currentStatus = 200;

function sendMessage(telegram, status) {
  if (currentStatus != status) {
    const message = (status == 200) ?
      `${upMessage}\n Site: ${uptimeUrl}\nStatus: ${status}` :
      `${downMessage}\n Site: ${uptimeUrl}\nStatus: ${status}`;
    recipients.forEach((recipient) => {
      (recipient) && telegram.sendMessage(recipient, message);
    });
  }
  currentStatus = status;
}

module.exports = (telegram) => {
  const job = new CronJob(`0 */${frequency} * * * *`, () => {
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