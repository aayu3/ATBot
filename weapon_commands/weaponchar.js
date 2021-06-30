const weaponSearch = require("../weaponSearch.js");


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
    name: 'weaponchar',
    description : "Filter weapons by the character they belong to.",
    execute(msg, weapons, args) {
      let messageContents = sanitizeCommand(msg);
      if (messageContents[0] == "weaponchar") {
        // If there is only one argument
        if (messageContents.length <= 1) {
          msg.reply("Please provide an argument.");
        } else {
          let supporterName = messageContents.slice(1);
          let lowered = supporterName.join(" ").toLowerCase();
          console.log(lowered);
            filtered = weaponSearch.filterByCharacter(lowered, weapons);
          if (filtered.length > 1) {
            let messages = weaponSearch.printMultiWeapons(filtered);
            for (var i = 0; i < messages.length; i++) {
              msg.channel.send(messages[i]);
            }
          } else if (filtered.length == 1) {
            msg.channel.send(weaponSearch.printWeapon(filtered[0]));
          } else {
            msg.channel.send("There are no weapons that fit this category.");
          }
        } 
      }
    }
}

