require('dotenv').config()
const axios = require('axios');
const Telegraf = require('telegraf')
const Telegram = require('telegraf/telegram')
const token = process.env.BOT_TOKEN
const groupid = process.env.GROUP_ID
const uptimeUrl = process.env.UPTIME_URL
const telegram = new Telegram(token)
const bot = new Telegraf({ telegram })
const CronJob = require('cron').CronJob

const job = new CronJob('0 */1 * * * *', () => {
  axios.head(uptimeUrl)
    .then(response => {
      const status = response.status;
      if (response.status != 200) {
        const message = `Server sedang bermasalah, status: ${status}`
        telegram.sendMessage(groupid, message);
      }
    })
    .catch(err => console.log(err))
})

job.start()

bot.start((ctx) => ctx.reply('Welcome!'))
bot.startPolling()