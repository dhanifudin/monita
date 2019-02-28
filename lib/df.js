'use strict';

const treshold = process.env.DF_TRESHOLD;
const frequency = process.env.DF_FREQUENCY;
const message = process.env.DF_MESSAGE;

const os = require('os');
const df = require('node-df');
const Cron = require('cron').CronJob;
const helper = require('./helper');

const recipients = helper.getRecipients();

function replyMessage(ctx) {
  df((err, response) => {
    if (err) {
      console.log(err);
      ctx.reply('Something error!');
    }
    if (response.length) {
      const message = response
        .map((fs) => { return `${fs.mount} : ${fs.capacity * 100}%`; })
        .join('\n');
      ctx.reply(message);
    }
  });
}

module.exports = (bot, telegram) => {
  const job = new Cron(`0 */${frequency} * * * *`, () => {
    df((err, response) => {
      if (err) {
        console.error(err);
      }
      if (response.length) {
        const storages = response
          .filter(fs => fs.capacity * 100 > treshold);
        if (storages.length) {
          const storageMessage = storages
            .map((fs) => { return `${fs.mount} : ${fs.capacity * 100}%`; })
            .join('\n');

          recipients.forEach((recipient) => {
            (recipient) && telegram.sendMessage(recipient, `${message}\n${os.hostname()} \n ${storageMessage}`);
          });
        }
      }
    });
  });

  job.start();

  bot.command('df', (ctx) => {
    if (helper.isAdmin(ctx)) {
      replyMessage(ctx);
    }
  });
};