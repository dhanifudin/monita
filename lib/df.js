'use strict';

const adminId = process.env.ADMIN_ID;
const df = require('node-df');

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

module.exports = (bot) => {
  bot.command('df', (ctx) => {
    if (isAdmin(ctx)) {
      replyMessage(ctx);
    }
  });
};