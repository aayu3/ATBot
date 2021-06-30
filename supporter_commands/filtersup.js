const supporterSearch = require("../supporterSearch.js");

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
    name: 'filtersup',
    description : "Filter Supporters",
    execute(msg, supporters, args) {
      let messageContents = sanitizeCommand(msg);
      if (messageContents[0] == "filtersup") {
        // If there is only one argument
        if (messageContents.length <= 1) {
          msg.reply("Please provide an argument.");
        } else if (messageContents.length == 2) {
          let lowered = messageContents[1].toLowerCase();
          if (lowered === "ur" || lowered === "sr" || lowered == "rare") {
            let filtered = supporterSearch.filterByRarity(lowered, supporters);
            let messages = supporterSearch.printMultiSupporters(filtered);

            if (messages[0] === "") {
              msg.channel.send("There are no supporters that fit these requirements.");
            } else {
            for (var i = 0; i < messages.length; i++) {
            
              msg.channel.send(messages[i]);
              }
            }
          } else if (lowered === "suppress" || lowered === "protect" || lowered == "assist") {
            let filtered = supporterSearch.filterByType(lowered, supporters);
            let messages = supporterSearch.printMultiSupporters(filtered);

            if (messages[0] === "") {
              msg.channel.send("There are no supporters that fit these requirements.");
            } else {  
            for (var i = 0; i < messages.length; i++) {
              msg.channel.send(messages[i]);
            }
          }
          } else {
            let filtered = supporterSearch.filterBySource(lowered, supporters);
            if (filtered.length == 0) {
              msg.reply("Please use a valid filter argument:\n**Rarity:**\nUR\nSR\nRare\n**Type:**\nSuppress\nProtect\nAssist\nOr provide an source.")
            } else {
              let messages = supporterSearch.printMultiSupporters(filtered);
              if (messages[0] === "") {
                msg.channel.send("There are no supporters that fit these requirements.");
              } else {
              for (var i = 0; i < messages.length; i++) {
                msg.channel.send(messages[i]);
              }
            }
            }
          }
        } else if (messageContents.length > 5) {
            msg.reply("There are too many arguments.")
          } else {
            let filtered = supporters;
            for (var i = 1; i < messageContents.length; i++) {
              let lowered = messageContents[i].toLowerCase();
              if (lowered === "ur" || lowered === "sr" || lowered == "rare") {
                filtered = supporterSearch.filterByRarity(lowered, filtered);
              } else if (lowered === "suppress" || lowered === "protect" || lowered == "assist") {
                filtered = supporterSearch.filterByType(lowered, filtered);
              } else {
                filtered = supporterSearch.filterBySource(lowered, filtered);
                if (filtered.length == 0) {
                  msg.reply("Please use a valid filter argument:\n**Rarity:**\nUR\nSR\nRare\n**Type:**\nSuppress\nProtect\nAssist\nOr provide an source.")
                } 
              }
            }
            let messages = supporterSearch.printMultiSupporters(filtered);
            if (messages[0] === "") {
              msg.channel.send("There are no supporters that fit these requirements.");
            } else {
              for (var i = 0; i < messages.length; i++) {
                if (messages[i].length == 0) {
                  msg.channel.send("There are no supporters that fit these requirements.");
                }
                msg.channel.send(messages[i]);
              }
            }  
        }  
      }
    }
}

