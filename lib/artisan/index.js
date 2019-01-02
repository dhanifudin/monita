'use strict';

const cache = require('./cache');

module.exports = (bot) => {
  bot.command('artisan', (ctx) => {
    const text = ctx.update.message.text;
    const args = (text) && text.split(' ');
    if (args.length == 3 && args[2] == 'cache:clear') {
      cache.clear(ctx, args[1]);
    } else {
      ctx.reply('Perintah artisan tidak tersedia!');
    }
  })
}