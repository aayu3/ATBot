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
    name: 'filterwep',
    description : "Filter weapons by rarity.",
    execute(msg, weapons, args) {
      let messageContents = sanitizeCommand(msg);
      if (messageContents[0] == "filterwep") {
        // If there is only one argument
        if (messageContents.length <= 1) {
          msg.reply("Please provide an argument.");
        } else if (messageContents.length == 2) {
          let lowered = messageContents[1].toLowerCase();
          if (lowered === "ur" || lowered === "sr" || lowered == "rare" || lowered == 'normal') {
            let filtered = weaponSearch.filterByRarity(lowered, weapons);
            let messages = weaponSearch.printMultiWeapons(filtered);

            if (messages[0] === "") {
              msg.channel.send("There are no weapons that fit these requirements.");
            } else {
            for (var i = 0; i < messages.length; i++) {
            
              msg.channel.send(messages[i]);
            }
          }
          } else if (characters.includes(lowered)) {
            let filtered = weaponSearch.filterByCharacter(lowered, weapons);
            let messages = weaponSearch.printMultiSupporters(filtered);

            if (messages[0] === "") {
              msg.channel.send("There are no weapons that fit these requirements.");
            } else {
              
            for (var i = 0; i < messages.length; i++) {
              msg.channel.send(messages[i]);
            }
          }
          } else {
            let filtered = weaponSearch.filterBySource(lowered, weapons);
            if (filtered.length == 0) {
              msg.reply("Please use a valid filter argument:\n**Rarity:**\nUR\nSR\nR\nN\nOr provide an source.")
            } else {
              let messages = weaponSearch.printMultiWeapons(filtered);
              if (messages[0] === "") {
                msg.channel.send("There are no weapons that fit these requirements.");
              } else {
              for (var i = 0; i < messages.length; i++) {
                msg.channel.send(messages[i]);
              }
            }
            }
          }
        } else if (messageContents.length > 3) {
            msg.reply("There are too many arguments.")
          } else {
            let filtered = weapons;
            for (var i = 1; i < messageContents.length; i++) {
              let lowered = messageContents[i].toLowerCase();
              if (lowered === "ur" || lowered === "sr" || lowered == "rare" || lowered === 'normal') {
                filtered = weaponSearch.filterByRarity(lowered, filtered);
              } else {
                filtered = weaponSearch.filterBySource(lowered, filtered);
                if (filtered.length == 0) {
                  msg.reply("Please use a valid filter argument:\n**Rarity:**\nUR\nSR\nR\nN\nOr provide an source.")
                } 
              }
            }
            let messages = weaponSearch.printMultiWeapons(filtered);
            if (messages[0] === "") {
              msg.channel.send("There are no weapons that fit these requirements.");
            } else {
              for (var i = 0; i < messages.length; i++) {
                if (messages[i].length == 0) {
                  msg.channel.send("There are no weapons that fit these requirements.");
                }
                msg.channel.send(messages[i]);
              }
            }
        }  
      }
    }
}

