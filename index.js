'use strict'

require('dotenv').config()
const Telegraf = require('telegraf')
const Telegram = require('telegraf/telegram')
const token = process.env.BOT_TOKEN
const telegram = new Telegram(token)
const bot = new Telegraf({ telegram })
const uptime = require('./uptime')(telegram)

bot.start((ctx) => ctx.reply('Welcome!'))
bot.startPolling()