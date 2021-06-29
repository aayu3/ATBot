const Discord = require('discord.js');
const fs = require('fs');
const supporterSearch = require("./supporterSearch.js");
const weaponSearch = require("./weaponSearch.js")
const request = require('request');
require('dotenv').config();

const characters = ["igawa asagi", "igawa sakura", "mizuki yukikaze", "akiyama rinko", "mizuki shiranui", "yatsu murasaki", "emily simmons", "su jinglei", "koukawa oboro", "shinganji kurenai", "loukawa asuka", "onisaki kirara", "ingrid"];

const url = "https://aayu3.github.io/ATBotJSONDependencies/supporters.json";
let options = {json: true};


var supporters = [];
var weapons = [];
request(url, options, (error, res, body) => {
    if (error) {
        return  console.log(error)
    };

    if (!error && res.statusCode == 200) {
        supporters = body;
    };
});

const weaponurl = "https://aayu3.github.io/ATBotJSONDependencies/weapons.json";
request(weaponurl, options, (error, res, body) => {
  if (error) {
      return  console.log(error)
  };

  if (!error && res.statusCode == 200) {
      weapons = body;
  };
});
//get files ready
/*
let rawdata = fs.readFileSync("supporters.json");
supporters = JSON.parse(rawdata);
*/

const adminID = 817548398453325864;
const moderatorID = 817631086673788938;
const memberID = 817541859672981514;
const mutedID = 824030853298257982;
const tooHornyID = 818316012121882644;

const client = new Discord.Client({
  partials: ['MESSAGE', 'REACTION', 'CHANNEL'],
});
client.commands = new Discord.Collection();

// load commands in adminitrative_commands
const admincommandFiles = fs.readdirSync('./administrative_commands').filter(file => file.endsWith(".js"));

// add them to the collection
for (const file of admincommandFiles) {
  const command = require(`./administrative_commands/${file}`);
  client.commands.set(command.name, command);
}

// function to sanitize msgs and return an array of commands and arguments
// returns 0 if the message is not a command
// i.e `!mute @jeff` becomes ['mute', 'jeff'];
const prefix = "!";

function sanitizeCommand(msg) {
    if (!msg.content.startsWith(prefix)) return 0;
    let sanitized = msg.content.replace(prefix,'');
    return sanitized.split(" ");
  }

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
  console.log('The Bot is ready!')
});





// list emote command
client.on('message', (msg) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  
  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift();

  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(msg, args);
  } catch (error) {
    console.error(error);
    msg.reply("Error trying to execute this command.");
  }
  
});







// Search by number or name
client.on('message', (msg) => {
  let messageContents = sanitizeCommand(msg);
  if (messageContents[0] == "supporter") {
    if(messageContents.length > 1) {
      if (isNaN(parseInt(messageContents[1]))) {
        // In this case the person is searching by name
        if (messageContents[1].toLowerCase() == "all") {
          let all = supporterSearch.printMultiSupporters(supporters);
          for (var i = 0; i < all.length; i++) {
            msg.channel.send(all[i]);
          }
        } else {
          let searchTerms = messageContents.shift();
          let searchName = messageContents.join(" ");
          let filteredSups = supporterSearch.filterByName(searchName, supporters);
          if (filteredSups.length == 0) {
            msg.reply("There is no supporter with the name: " + searchName);
          } else if (filteredSups.length == 1) {
            let sup = filteredSups[0];
            msg.channel.send(supporterSearch.printSupporter(sup));
            msg.channel.send("https://aayu3.github.io/ATBotJSONDependencies/supporter_images/" + sup.Icon + "_1.png");
          } else {
            let strings = supporterSearch.printMultiSupporters(filteredSups);
            for (var i = 0; i < strings.length; i++) {
              msg.channel.send(strings[i]);
            }
          }
        }
      } else {
        // In this case the person is searching by number
        let num = parseInt(messageContents[1]) - 1;
        if (num < 0 || num > supporters.length - 1) {
          msg.reply("Please provide a number in the correct range: 1 - " + (supporters.length));
        } else {
          let sup = supporterSearch.searchByNumber(num + 1, supporters);
          msg.channel.send(supporterSearch.printSupporter(sup));
          msg.channel.send("https://aayu3.github.io/ATBotJSONDependencies/supporter_images/" + sup.Icon + "_1.png");
        }
      }
    } else {
      msg.reply("Please provide a proper argument");
    }
    
  }
});

// filter by source, type, or rarity
client.on('message', (msg) => {
  let messageContents = sanitizeCommand(msg);
  if (messageContents[0] == "filtersup") {
    // If there is only one argument
    if (messageContents.length <= 1) {
      msg.reply("Please provide an argument.");
    } else if (messageContents.length == 2) {
      let lowered = messageContents[1].toLowerCase();
      if (lowered === "ur" || lowered === "sr" || lowered == "r") {
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
          msg.reply("Please use a valid filter argument:\n**Rarity:**\nUR\nSR\nR\n**Type:**\nSuppress\nProtect\nAssist\nOr provide an source.")
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
          if (lowered === "ur" || lowered === "sr" || lowered == "r") {
            filtered = supporterSearch.filterByRarity(lowered, filtered);
          } else if (lowered === "suppress" || lowered === "protect" || lowered == "assist") {
            filtered = supporterSearch.filterByType(lowered, filtered);
          } else {
            filtered = supporterSearch.filterBySource(lowered, filtered);
            if (filtered.length == 0) {
              msg.reply("Please use a valid filter argument:\n**Rarity:**\nUR\nSR\nR\n**Type:**\nSuppress\nProtect\nAssist\nOr provide an source.")
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
});

// Search weapon by number or name
client.on('message', (msg) => {
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
});

// filter by source, type, or rarity
client.on('message', (msg) => {
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
});


client.on('message', (msg) => {
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
});
// Token Change
