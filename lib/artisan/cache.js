'use strict';

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = {
  clear: (ctx, profile) => {
    const profilePath = path.normalize(`${__dirname}/../../profiles/${profile}.json`);
    fs.readFile(profilePath, (err, data) => {
      if (err) ctx.reply('Profile tidak ditemukan');
      const dataProfile = JSON.parse(data);
      const { documentroot } = dataProfile;
      exec(`php ${documentroot}/artisan cache:clear`, (err, stdout, stderr) => {
        if (err) throw err;
        ctx.reply(`${profile} ${stdout}`);
      })
    });
  }
}