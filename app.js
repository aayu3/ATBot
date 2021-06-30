const Discord = require('discord.js');
const fs = require('fs');
const weaponSearch = require("./weaponSearch.js");
const request = require('request');
require('dotenv').config();

const characters = ["igawa asagi", "igawa sakura", "mizuki yukikaze", "akiyama rinko", "mizuki shiranui", "yatsu murasaki", "emily simmons", "su jinglei", "koukawa oboro", "shinganji kurenai", "loukawa asuka", "onisaki kirara", "ingrid"];

const url = "https://aayu3.github.io/ATBotJSONDependencies/supporters.json";
let options = {json: true};

// Initiate Gacha pool

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
client.admin_commands = new Discord.Collection();
client.supporter_commands = new Discord.Collection();
client.weapon_commands = new Discord.Collection();
client.gacha_commands = new Discord.Collection();

// Load commands in adminitrative_commands
const admincommandFiles = fs.readdirSync('./administrative_commands').filter(file => file.endsWith(".js"));

// Add them to the collection
for (const file of admincommandFiles) {
  const command = require(`./administrative_commands/${file}`);
  client.admin_commands.set(command.name, command);
}

// Load commands in adminitrative_commands
const supportercommandFiles = fs.readdirSync('./supporter_commands').filter(file => file.endsWith(".js"));

// Add them to the collection
for (const file of supportercommandFiles) {
  const command = require(`./supporter_commands/${file}`);
  client.supporter_commands.set(command.name, command);
}

// Load commands in adminitrative_commands
const weaponcommandFiles = fs.readdirSync('./weapon_commands').filter(file => file.endsWith(".js"));

// Add them to the collection
for (const file of weaponcommandFiles) {
  const command = require(`./weapon_commands/${file}`);
  client.weapon_commands.set(command.name, command);
}

// Load commands in adminitrative_commands
const gachacommandFiles = fs.readdirSync('./gacha_commands').filter(file => file.endsWith(".js"));

// Add them to the collection
for (const file of gachacommandFiles) {
  const command = require(`./gacha_commands/${file}`);
  client.gacha_commands.set(command.name, command);
}



// function to sanitize msgs and return an array of commands and arguments
// returns 0 if the message is not a command
// i.e `!mute @jeff` becomes ['mute', 'jeff'];
const prefix = "!";

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
  console.log('The Bot is ready!')
});






// list emote command
client.on('message', (msg) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  
  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift();

  if (client.admin_commands.has(command)) {
    try {
      client.admin_commands.get(command).execute(msg, client, args);
    } catch (error) {
      console.error(error);
      msg.reply("Error trying to execute this command.");
    }
  } else if (client.supporter_commands.has(command)) {
    try {
      client.supporter_commands.get(command).execute(msg, supporters, args);
    } catch (error) {
      console.error(error);
      msg.reply("Error trying to execute this command.");
    }
  } else if (client.weapon_commands.has(command)) {
    try {
      client.weapon_commands.get(command).execute(msg, weapons, args);
    } catch (error) {
      console.error(error);
      msg.reply("Error trying to execute this command.");
    }
  } else if (client.gacha_commands.has(command)) {
    try {
      client.gacha_commands.get(command).execute(msg, supporters, weapons, args);
    } catch (error) {
      console.error(error);
      msg.reply("Error trying to execute this command.");
    }
  } else {
    return;
  }
});
// Token Change
