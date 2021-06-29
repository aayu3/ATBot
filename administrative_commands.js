const supporterSearch = require("./supporterSearch.js");
const weaponSearch = require("./weaponSearch.js")

module.exports = {
    name: 'commands',
    description : "Display the bot commands",
    execute(message, args) {
        let messageContents = sanitizeCommand(msg);
        if (messageContents[0] == "website") {
          msg.reply("https://aayu3.github.io/ATBotJSONDependencies/");
          }
      }
}