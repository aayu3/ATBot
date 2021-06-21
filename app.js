const Discord = require('discord.js');
const fs = require('fs');
const supporterSearch = require("./supporterSearch.js");
const weaponSearch = require("./weaponSearch.js")
const request = require('request');
const cheerio = require('cheerio');
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
const prefix = "!";
const adminID = 817548398453325864;
const moderatorID = 817631086673788938;
const memberID = 817541859672981514;
const mutedID = 824030853298257982;
const tooHornyID = 818316012121882644;

const client = new Discord.Client({
  partials: ['MESSAGE', 'REACTION', 'CHANNEL'],
});

// Get names of emotes from taimanin_emotes so the bot can search for them
let emotePath = "taimanin_emotes";
let emoteNames = fs.readdirSync(emotePath);

function searchEmoteInArray (str, strArray) {
  for (var j=0; j<strArray.length; j++) {
      if (strArray[j] === str + ".png") {
        return j;
      }
  }
  return -1;
}

// function to sanitize msgs and return an array of commands and arguments
// returns 0 if the message is not a command
// i.e `!mute @jeff` becomes ['mute', 'jeff'];
function sanitizeCommand(msg) {
  if (!msg.content.startsWith(prefix)) return 0;
  let sanitized = msg.content.replace(prefix,'');
  return sanitized.split(" ");
}

// function to get a user from the client.users.cache Collection given a mention
function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}

// function to get a user from the client.users.cache Collection given a mention
function getMemberFromMention(msg) {
	return msg.mentions.members.first();
}


//Emote List Embed
const emotesEmbed = new Discord.MessageEmbed()
                      .setColor('#0099ff')
                      .setTitle('Emotes');

function addEmoteNamesToEmbed(emotes, embed, messageStart, messageEnd) {
  embed.fields = [];
  let commands = emotes[messageStart].split(".")[0];
  for (var j=messageStart+1; j<messageEnd; j++) {
    commands = commands + "\n" + emotes[j].split(".")[0];
  }
  embed.addField("Commands: ", commands);
}


client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
  console.log('The Bot is ready!')
});

// Search for emote name and replace with image
client.on('message', (msg) => {
  let messageContents = sanitizeCommand(msg);
  let result = searchEmoteInArray(messageContents[0], emoteNames);
  if (result !== -1) {
    const channel = msg.channel;
    channel.send({files: ["taimanin_emotes/" + emoteNames[result]]});
    console.log(emoteNames[result]);
    msg.delete();
  }
});

// list emote command
client.on('message', (msg) => {
  let messageContents = sanitizeCommand(msg);
  if (messageContents[0] == "emotes") {
    const channel = msg.channel;
    addEmoteNamesToEmbed(emoteNames,emotesEmbed,0,6);
    channel.send(emotesEmbed).then(sentEmbed => {
    sentEmbed.react("⬅")
    sentEmbed.react("➡")
    });
  }
});

// list emote command
client.on('message', (msg) => {
  let messageContents = sanitizeCommand(msg);
  if (messageContents[0] == "website") {
    msg.reply("https://aayu3.github.io/ATBotJSONDependencies/");
    }
});

client.on('message', (msg) => {
  let messageContents = sanitizeCommand(msg);
  if (messageContents[0] == "commands") {
    msg.reply("__**Supporters**__\n!supporter [Name/Number]\n!filtersup [Rarity/Status/Type/Source]\n!intimacy [Name]\n__**Weapons**__\n!weapon [Name/Number]\n!filterwep [Rarity/Source]\n!weaponchar [Character]\n__**Guides**__\n!guide (For Beginner's Guide)\n!reroll (For Reroll Guide)");
    }
});

//mute command
client.on('message', (msg) => {
  let messageContents = sanitizeCommand(msg);
  if (messageContents[0] == "mute") {
    if(msg.member.roles.cache.some(r=>["Admin", "Moderator", "Reddit Moderator"].includes(r.name)) ) {
      if (messageContents.length <= 1) {
        msg.reply("Please specify a user to mute");
      } else {
        let userMentioned = getUserFromMention(messageContents[1]);
        let memberMentioned = getMemberFromMention(msg);
        if (!userMentioned) {
          return msg.reply('Please use a proper mention to mute');
        } else {
          // using this as a temporary solution until i fix getMemberFromMention
          let mutedRole = msg.guild.roles.cache.find(r => r.name === "Muted");
          let memberRole = msg.guild.roles.cache.find(r => r.name === "Member");
          memberMentioned.roles.add(mutedRole);
          memberMentioned.roles.remove(memberRole);
          msg.reply(userMentioned.toString() + " has been muted");


        }
      }
    } else {
      msg.reply("You do not have sufficient permission to use this command.")
    }
  }
});


//bonk function for too horny role
//mute command
client.on('message', (msg) => {
  let messageContents = sanitizeCommand(msg);
  if (messageContents[0] == "bonk") {
    if(msg.member.roles.cache.some(r=>["Admin", "Moderator", "Reddit Moderator"].includes(r.name)) ) {
      if (messageContents.length <= 1) {
        msg.reply("Please specify a user to bonk");
      } else {
        let userMentioned = getUserFromMention(messageContents[1]);
        let memberMentioned = getMemberFromMention(msg);
        if (!userMentioned) {
          return msg.reply('Please use a proper mention to bonk');
        } else {
          // using this as a temporary solution until i fix getMemberFromMention
          let hornyRole = msg.guild.roles.cache.find(r => r.name === "Horny");
          let memberRole = msg.guild.roles.cache.find(r => r.name === "Member");
          memberMentioned.roles.add(hornyRole);
          memberMentioned.roles.remove(memberRole);
          msg.reply(userMentioned.toString() + " has been sent to <#818313211538309130>");
          msg.channel.send({files: ["bonk.gif"]});
        }
      }
    } else {
      msg.reply("You do not have sufficient permission to use this command.");
    }
  }
});

// change name function
client.on('message', (msg) => {
  let messageContents = sanitizeCommand(msg);
  if (messageContents[0] == "setName") {
    if(msg.member.roles.cache.some(r=>["Admin", "Moderator", "Reddit Moderator"].includes(r.name)) ) {
      messageContents.shift();
      let name = messageContents.join(' ');
      client.user.setUsername(name);
      msg.reply("Name has been set to: " + name);
    } else {
      msg.reply("You do not have sufficient permission to use this command.")
    }
  }
});

// change status function
client.on('message', (msg) => {
  let messageContents = sanitizeCommand(msg);
  if (messageContents[0] == "setStatus") {
    if(msg.member.roles.cache.some(r=>["Admin", "Moderator", "Reddit Moderator"].includes(r.name)) ) {
      messageContents.shift();
      let name = messageContents.join(' ');
      client.user.setActivity(name);
      msg.reply("Status has been set to: " + name);
    } else {
      msg.reply("You do not have sufficient permission to use this command.")
    }
  }
});

// get emote as string function
client.on('message', (msg) => {
  let messageContents = sanitizeCommand(msg);
  if (messageContents[0] == "getEmote") {
    if(msg.member.roles.cache.some(r=>["Admin", "Moderator", "Reddit Moderator"].includes(r.name)) ) {
      messageContents.shift();
      let name = messageContents.join(' ');
      msg.reply("The emote is: ```" + name + "```");
    } else {
      msg.reply("You do not have sufficient permission to use this command.")
    }
  }
});

// change avatar function
client.on('message', (msg) => {
  let messageContents = sanitizeCommand(msg);
  if (messageContents[0] == "setAvatar") {
    if(msg.member.roles.cache.some(r=>["Admin", "Moderator", "Reddit Moderator"].includes(r.name)) ) {
      messageContents.shift();
      let name = messageContents.join(' ');
      client.user.setAvatar(name);
    } else {
      msg.reply("You do not have sufficient permission to use this command.")
    }
  }
});

// get member ID
client.on('message', (msg) => {
  let messageContents = sanitizeCommand(msg);
  if (messageContents[0] == "getMemberID") {
    let memberMentioned = getMemberFromMention(msg);
    console.log(memberMentioned.id);
  }
});

// test member id
client.on('message', (msg) => {
  let messageContents = sanitizeCommand(msg);
  if (messageContents[0] == "pingMemberByID") {
    let memberMentioned = msg.guild.members.cache.get(messageContents[1]);
    msg.channel.send(memberMentioned.toString());
  }
});

// guide command
client.on('message', (msg) => {
  let messageContents = sanitizeCommand(msg);
  if (messageContents[0] == "guide") {
    msg.reply("Here is the beginner's guide: http://actiontaiman.in/beginner_guide.html");
  }
});

// reroll command
client.on('message', (msg) => {
  let messageContents = sanitizeCommand(msg);
  if (messageContents[0] == "reroll") {
    msg.reply("Here is the reroll guide: http://actiontaiman.in/reroll_guide.html");
  }
});

// intimacy command
client.on('message', (msg) => {
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
          msg.channel.send("https://aayu3.github.io/ATBotJSONDependencies/intimacy_images/Supporter_" + sup.Unawakened + ".png");
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
          msg.channel.send("https://aayu3.github.io/ATBotJSONDependencies/intimacy_images/Supporter_" + sup.Unawakened + ".png");
        }
      }
      
    }
    else {
      msg.reply("Please provide an argument.")
    }
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
            msg.channel.send("https://aayu3.github.io/ATBotJSONDependencies/supporter_images/" + sup.Awakened + ".png");
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
          msg.channel.send("https://aayu3.github.io/ATBotJSONDependencies/supporter_images/" + sup.Awakened + ".png");
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
      } else if (lowered === "released" || lowered === "unreleased" ) {
        let filtered = supporterSearch.filterByStatus(lowered, supporters);
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
          } else if (lowered === "released" || lowered === "unreleased") {
            filtered = supporterSearch.filterByStatus(lowered, filtered);
          }
           else {
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
