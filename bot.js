const constants = require('./lib/constants.js');  // constants and settings
const IRC = require('./lib/irc.js'); // connected IRC Client

// Hack
// TODO: Better way to ensure one instance of bot only (pid file method breaks if process exits unexpectedly)
var app = require('express')();
app.listen(22537);

// Global Variables
let isRolling=false;
let participants=[];

// Main listener
IRC.addListener('raw',(message) => {
  if(message.command==='PRIVMSG' &&
    (message.args[0].toLowerCase()===constants.IRC_CHAN.toLowerCase()))
      parse(message.nick,message.args[1]);
});

// Main bot processor
function parse(from,msg) {
  switch(msg.toLowerCase()) {
    case "!roulette":  roulette();
      break;
    case "!roll":  roll(from);
      break;
    default:
      break;
  }
}

// roulette
function roulette() {
  if(!isRolling) {
    IRC.say(constants.IRC_CHAN,"Starting roll, type !roll - you have 30 seconds");
    isRolling=true;
    setTimeout(() => {
      isRolling=false;
      IRC.say(constants.IRC_CHAN,"Roulette ended.");
      highest=0;
      highest_person='';
      for ( var person in participants ) {
        if(participants[person]>highest) {
          highest=participants[person];
          highest_person=person;
        }
      }
      IRC.say(constants.IRC_CHAN,"The winner is " + highest_person + " with a score of " + highest);
      participants=[];
    },30000);
  }
  else {
    IRC.say(constants.IRC_CHAN,"In a roulette right now.");
  }
}
function roll(from) {
  if(isRolling) {
    if(typeof participants[from] === 'undefined') {
      _roll = (Math.floor(Math.random() * 100)+1);
      IRC.say(constants.IRC_CHAN,constants.BOLD+from+': '+_roll+' out of 100');
      participants[from]=_roll;
    }
    else
      IRC.say(constants.IRC_CHAN,'You already rolled, '+from);
  }
  else {
    IRC.say(constants.IRC_CHAN,"We're not rolling.");
  }
}
