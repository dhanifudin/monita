'use strict';

const adminEnv = process.env.ADMIN_ID;
const groupId = process.env.GROUP_ID;

const admins = (adminEnv) && adminEnv.split(',').map(value => parseInt(value, 10));
const recipients = [].concat(admins, groupId);

module.exports = {
  getRecipients: () => {
    return recipients;
  },
  isAdmin: (ctx) => {
    const senderId = ctx.update.message.from.id;
    return admins.indexOf(senderId) > -1;
  }
}