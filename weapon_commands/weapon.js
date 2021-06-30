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
    name: 'weapon',
    description : "Search for a weapon by name or number.",
    execute(msg, weapons, args) {
      let messageContents = sanitizeCommand(msg);
      if (messageContents[0] == "weapon") {
        if(messageContents.length > 1) {
          if (isNaN(parseInt(messageContents[1]))) {
            // In this case the person is searching by name
            if (messageContents[1].toLowerCase() == "all") {
              let all = weaponSearch.printMultiWeapons(weapons);
              for (var i = 0; i < all.length; i++) {
                msg.channel.send(all[i]);
              }
            } else {
              let searchTerms = messageContents.shift();
              let searchName = messageContents.join(" ");
              console.log(searchName);
              let filteredWeps = weaponSearch.filterByName(searchName, weapons);
              if (filteredWeps.length == 0) {
                msg.reply("There is no weapon with the name: " + searchName);
              } else if (filteredWeps.length == 1) {
                let wep = filteredWeps[0];
                msg.channel.send(weaponSearch.printWeapon(wep));
                msg.channel.send("https://aayu3.github.io/ATBotJSONDependencies/weapon_images/" + wep.Icon);
              } else {
                let strings = weaponSearch.printMultiWeapons(filteredWeps);
                for (var i = 0; i < strings.length; i++) {
                  msg.channel.send(strings[i]);
                }
              }
            }
          } else {
            // In this case the person is searching by number
            let num = parseInt(messageContents[1]) - 1;
            if (num < 0 || num > weapons.length - 1) {
              msg.reply("Please provide a number in the correct range: 1 - " + (weapons.length));
            } else {
              let wep = weaponSearch.searchByNumber(num + 1, weapons);
              msg.channel.send(weaponSearch.printWeapon(wep));
              msg.channel.send("https://aayu3.github.io/ATBotJSONDependencies/weapon_images/" + wep.Icon);
            }
          }
        } else {
          msg.reply("Please provide a proper argument");
        }
      }
    }
}

