// function to sanitize msgs and return an array of commands and arguments
// returns 0 if the message is not a command
// i.e `!mute @jeff` becomes ['mute', 'jeff'];
const prefix = "!";

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


module.exports = {
    name: 'mute',
    description : "Mute a member",
    execute(msg, args) {
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
      }
}