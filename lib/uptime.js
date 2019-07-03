'use strict';

const uptimeUrls = process.env.UPTIME_URLS;
const frequency = process.env.UPTIME_FREQUENCY;
const upMessage = process.env.UPTIME_UP_MESSAGE;
const downMessage = process.env.UPTIME_DOWN_MESSAGE;
const urls = uptimeUrls.split(',');

const axios = require('axios');
const CronJob = require('cron').CronJob;
const helper = require('./helper');

const recipients = helper.getRecipients();

let currentStatus = 200;

function sendMessage(telegram, url, status) {
  if (currentStatus != status) {
    const message = (status == 200) ?
      `${upMessage}\n Site: ${url}\nStatus: ${status}` :
      `${downMessage}\n Site: ${url}\nStatus: ${status}`;
    recipients.forEach((recipient) => {
      (recipient) && telegram.sendMessage(recipient, message);
    });
  }
  currentStatus = status;
}

module.exports = (telegram) => {
  const job = new CronJob(`0 */${frequency} * * * *`, () => {
    urls.forEach((url) => {
      console.log(url);
      axios.head(url)
        .then(response => {
          const status = response.status;
          sendMessage(telegram, url, status);
        })
        .catch(err => {
          if (err.response) {
            const status = err.response.status;
            sendMessage(telegram, url, status);
          }
        });
    });
  });

  job.start();
};