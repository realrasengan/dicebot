const irc = require('irc');
const constants = require('./constants.js');
const fs = require('fs');


class IRC {
  constructor() {
    this.client = new irc.Client(constants.IRC_SERVER,constants.IRC_NICK, {
      userName: constants.IRC_USER,
      realName: constants.IRC_GECOS,
      sasl:true,
      password:fs.readFileSync(constants.PASSWORD_FILE,'utf-8').trim(),
      channels:[constants.IRC_CHAN]
    });
    this.client.addListener('error', function(message) {
      console.log('[e]: ', message);
    });
  }
  say(target,msg) {
    this.client.say(target,msg);
  }
  addListener(type,func) {
    this.client.addListener(type,func);
  }

}

module.exports = new IRC();
