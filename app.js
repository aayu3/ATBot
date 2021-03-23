const Discord = require('discord.js');
const Twit = require('twit');
const fs = require('fs');
require('dotenv').config();

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
// list emote command
client.on('message', (msg) => {
  let messageContents = sanitizeCommand(msg);
  if (msg.content == "mute") {
    
  }
});


// Adding Jokes Function

// Jokes from dcslsoftware.com/20-one-liners-only-software-developers-understand/
// www.journaldev.com/240/my-25-favorite-programming-quotes-that-are-funny-too
/*
const jokes = [
  'I went to a street where the houses were numbered 8k, 16k, 32k, 64k, 128k, 256k and 512k. It was a trip down Memory Lane.',
  'If doctors were like software engineers, they would say things like “Have you tried killing yourself and being reborn?”',
  '“Debugging” is like being the detective in a crime drama where you are also the murderer.',
  'The best thing about a Boolean is that even if you are wrong, you are only off by a bit.',
  'A programmer puts two glasses on his bedside table before going to sleep. A full one, in case he gets thirsty, and an empty one, in case he doesn’t.',
  'If you listen to a UNIX shell, can you hear the C?',
  'Why do Java programmers have to wear glasses? Because they don’t C#.',
  'What sits on your shoulder and says “Pieces of 7! Pieces of 7!”? A Parroty Error.',
  'When Apple employees die, does their life HTML5 in front of their eyes?',
  'The best thing about a boolean is even if you are wrong, you are only off by a bit.',
  'Without requirements or design, programming is the art of adding bugs to an empty text file.',
  'Before software can be reusable it first has to be usable.',
  'The best method for accelerating a computer is the one that boosts it by 9.8 m/s2.',
  'I think Microsoft named .Net so it wouldn’t show up in a Unix directory listing.',
  'There are two ways to write error-free programs; only the third one works.',
];

client.on('message', (msg) => {
  if (msg.content === '?joke') {
    msg.channel.send(jokes[Math.floor(Math.random() * jokes.length)]);
  }
});

// Adding Reaction Role Function
client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;
  if (!reaction.message.guild) return;
  if (reaction.message.channel.id == '802209416685944862') {
    if (reaction.emoji.name === '🦊') {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.add('802208163776167977');
    }
    if (reaction.emoji.name === '🐯') {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.add('802208242696192040');
    }
    if (reaction.emoji.name === '🐍') {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.add('802208314766524526');
    }
  } else return;
});

// Removing Reaction Roles
client.on('messageReactionRemove', async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;
  if (!reaction.message.guild) return;
  if (reaction.message.channel.id == '802209416685944862') {
    if (reaction.emoji.name === '🦊') {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.remove('802208163776167977');
    }
    if (reaction.emoji.name === '🐯') {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.remove('802208242696192040');
    }
    if (reaction.emoji.name === '🐍') {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.remove('802208314766524526');
    }
  } else return;
});

// Adding Twitter Forward Function
const T = new Twit({
  consumer_key: process.env.API_TOKEN,
  consumer_secret: process.env.API_SECRET,
  access_token: process.env.ACCESS_KEY,
  access_token_secret: process.env.ACCESS_SECRET,
  bearer_token: process.env.BEARER_TOKEN,
  timeout_ms: 60 * 1000,
});

// Destination Channel Twitter Forwards
const dest = '803285069715865601';
// Create a stream to follow tweets
const stream = T.stream('statuses/filter', {
  follow: '32771325', // @Stupidcounter
});

stream.on('tweet', (tweet) => {
  const twitterMessage = `Read the latest tweet by ${tweet.user.name} (@${tweet.user.screen_name}) here: https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
  client.channels.cache.get(dest).send(twitterMessage);
  return;
});
*/