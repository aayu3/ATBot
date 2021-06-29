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
    name: 'commands',
    description : "Display the bot commands",
    execute(msg, args) {
        let messageContents = sanitizeCommand(msg);
        if (messageContents[0] == "commands") {
          msg.reply("__**Supporters**__\n!supporter [Name/Number]\n!filtersup [Rarity/Type/Source]\n!intimacy [Name]\n__**Weapons**__\n!weapon [Name/Number]\n!filterwep [Rarity/Source]\n!weaponchar [Character]\n__**Guides**__\n!guide (For Beginner's Guide)\n!reroll (For Reroll Guide)");
          }
      }
}