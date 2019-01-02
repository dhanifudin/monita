'use strict';

require('dotenv').config();

const token = process.env.BOT_TOKEN;
const enableUptime = process.env.ENABLE_UPTIME;
const enableDf = process.env.ENABLE_DF;
const enableArtisan = process.env.ENABLE_ARTISAN;

const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');
const telegram = new Telegram(token);
const bot = new Telegraf(token, { telegram });

(enableUptime == 'true') && require('./lib/uptime')(telegram);
(enableDf == 'true') && require('./lib/df')(bot, telegram);
(enableArtisan == 'true') && require('./lib/artisan')(bot);

bot.start((ctx) => ctx.reply('Welcome!'));
bot.help((ctx) => ctx.reply('Help'));
bot.startPolling();