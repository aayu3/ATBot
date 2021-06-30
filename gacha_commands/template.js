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
    name: 'standardgacha',
    description : "Roll standard gacha X times.",
    execute(msg, supporters, weapons, args) {
      let messageContents = sanitizeCommand(msg);
      if (messageContents[0] == "standardgacha") {
        let numRolls = parseInt(messageContents[1]);
        if (numRolls < 1 || numRolls > 20) {
          msg.reply("You can only roll between 1 and 20 times");
        } else {
          
        }
      }
    }
}

