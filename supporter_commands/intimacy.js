const supporterSearch = require("../supporterSearch.js");

// function to sanitize msgs and return an array of commands and arguments
// returns 0 if the message is not a command
// i.e `!mute @jeff` becomes ['mute', 'jeff'];
const prefix = "!";

function sanitizeCommand(msg) {
    if (
      //!msg.content.startsWith(prefix)
      true
    ) return 0;
    let sanitized = msg.content.replace(prefix,'');
    return sanitized.split(" ");
  }

module.exports = {
    name: 'intimacy',
    description : "Display the intimacy scene of a supporter.",
    execute(msg, supporters, args) {
      let messageContents = sanitizeCommand(msg);
      if (messageContents[0] == "intimacy") {
        if(messageContents.length > 1) {
          if (isNaN(parseInt(messageContents[1]))) {
            // In this case the person is searching by name
            let searchName = messageContents.slice(1).join(" ");
            let filteredSups = supporterSearch.filterByName(searchName, supporters);
            if (filteredSups.length == 0) {
              msg.reply("There is no supporter with the name: " + searchName);
            } else if (filteredSups.length == 1) {
              let sup = filteredSups[0];
              msg.channel.send("https://aayu3.github.io/ATBotJSONDependencies/intimacy_images/" + sup.Icon + "_0.png");
            } else {
              msg.reply("Please be more specific")
            } 
          }
          else {
            // In this case the person is searching by number
            let num = parseInt(messageContents[1]) - 1;
            if (num < 0 || num > supporters.length - 1) {
              msg.reply("Please provide a number in the correct range: 1 - " + (supporters.length));
            } else {
              let sup = supporterSearch.searchByNumber(num + 1, supporters);
              msg.channel.send("https://aayu3.github.io/ATBotJSONDependencies/intimacy_images/" + sup.Icon + "_0.png");
            }
          }
        }
        else {
          msg.reply("Please provide an argument.")
        }
      }
    }
}

