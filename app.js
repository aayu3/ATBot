const Discord = require('discord.js');
const Twit = require('twit');
const fs = require('fs');
const supporterSearch = require("./supporterSearch.js")
require('dotenv').config();


//get files ready
let supporterPath = "supporter_json";
let supporterJSONs = fs.readdirSync(supporterPath);
const supporters = supporterSearch.parseJSON(supporterJSONs);


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

// Search by number
client.on('message', (msg) => {
  let messageContents = sanitizeCommand(msg);
  if (messageContents[0] == "search") {
    if (isNaN(parseInt(messageContents[1]))) {
      msg.reply("Please supply a valid search query");
    } else {
      let num = parseInt(messageContents[1]) - 1;
      if (num < 0 || num > supporters.length - 1) {
        msg.reply("Please provide a number in the correct range: 1 - " + supporters.length - 1);
      } else {
        let sup = supporterSearch.searchByNumber(num + 1, supporters);
        msg.channel.send(supporterSearch.printSupporter(sup));
        msg.channel.send({files: ["supporter_images/" + sup.Awakened + ".png"]});
      }
    }
  }
});

// Token Change
