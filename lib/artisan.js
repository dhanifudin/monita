'use strict';

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const commands = [
  'cache:clear',
  'view:clear',
];

function isCommandAvailable(command) {
  return commands.indexOf(command) > -1;
}

function readProfile(profile, callback) {
  const profilePath = path.normalize(`${__dirname}/../profiles/${profile}.json`);
  fs.readFile(profilePath, (err, data) => {
    if (err) callback(err, null);
    const profileData = JSON.parse(data);
    callback(null, profileData);
  });
}

function execArtisan(ctx, profile, command) {
  readProfile(profile, (err, profileData) => {
    if (err) {
      console.log(err);
      ctx.reply('Something error');
    }
    const { documentroot } = profileData;
    exec(`php ${documentroot}/artisan ${command}`, (err, stdout) => {
      if (err) {
        console.log(err);
        ctx.reply('Something error!');
      }
      ctx.reply(`${profile} ${stdout}`);
    });
  });
}

module.exports = (bot) => {
  bot.command('artisan', (ctx) => {
    const text = ctx.update.message.text;
    const args = (text) && text.split(' ');
    const length = args.length;
    const profile = args[1];
    const command = (length == 2) ? args[1] : args[2];
    if (length == 3 && isCommandAvailable(command)) {
      execArtisan(ctx, profile, command);
    } else if (length == 2 && command == 'list') {
      const message = commands.join('\n');
      ctx.reply(message);
    } else {
      const availableCommand = commands.join('\n');
      ctx.reply(`Perintah artisan tidak tersedia! \n ${availableCommand}`);
    }
  })
}