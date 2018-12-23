'use strict'

const groupid = process.env.GROUP_ID
const uptimeUrl = process.env.UPTIME_URL

const axios = require('axios');
const CronJob = require('cron').CronJob
let currentStatus = 200

module.exports = (telegram) => {
  const job = new CronJob('0 */1 * * * *', () => {
    console.log(uptimeUrl)
    axios.head(uptimeUrl)
      .then(response => {
        const status = response.status
        if (currentStatus != status) {
          const message = `Server ${uptimeUrl} sehat kembali, status: ${status}`
          telegram.sendMessage(groupid, message)
        }
        currentStatus = status
      })
      .catch(err => {
        if (err.response) {
          const status = err.response.status
          if (currentStatus != status) {
            const message = `Server ${uptimeUrl} sedang bermasalah, status: ${status}`
            telegram.sendMessage(groupid, message)
          }
          currentStatus = status
        }
      })
  })

  job.start()
}