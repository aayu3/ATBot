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
    name: 'getMemberID',
    description : "Gets the mentioned member's ID",
    execute(msg, args) {
      let messageContents = sanitizeCommand(msg);
      if (messageContents[0] == "getMemberID") {
        let memberMentioned = getMemberFromMention(msg);
        msg.reply("Member ID: " + memberMentioned.id);
      }
    }
}

