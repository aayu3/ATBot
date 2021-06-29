const supporterSearch = require("../supporterSearch.js");
const weaponSearch = require("../weaponSearch.js")

// function to sanitize msgs and return an array of commands and arguments
// returns 0 if the message is not a command
// i.e `!mute @jeff` becomes ['mute', 'jeff'];
const prefix = "!";

function sanitizeCommand(msg) {
    if (!msg.content.startsWith(prefix)) return 0;
    let sanitized = msg.content.replace(prefix,'');
    return sanitized.split(" ");
  }

module.exports = {
    name: 'guide',
    description : "Display the beginner guide",
    execute(msg, args) {
      let messageContents = sanitizeCommand(msg);
      if (messageContents[0] == "guide") {
        msg.reply("Here is the beginner's guide: http://actiontaiman.in/beginner_guide.html");
      }
    }
}

