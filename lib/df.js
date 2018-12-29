'use strict';

const adminId = process.env.ADMIN_ID;
const groupId = process.env.GROUP_ID;
const treshold = process.env.DF_TRESHOLD;
const frequency = process.env.DF_FREQUENCY;
const message = process.env.DF_MESSAGE;

const os = require('os');
const df = require('node-df');
const Cron = require('cron').CronJob;

const recipients = [].concat(adminId, groupId);

function isAdmin(ctx) {
  const senderId = ctx.update.message.from.id;
  return senderId == adminId;
}

function replyMessage(ctx) {
  df((err, response) => {
    if (err) throw err;
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
      if (err) throw err;
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
    if (isAdmin(ctx)) {
      replyMessage(ctx);
    }
  });
};