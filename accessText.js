const fs = require('fs');
const Discord = require('discord.js');

// Takes a file name, a member object, and a timeOfRelease, in miliseconds
function writeMuteData(file, userInfo, timeOfRelease) {
    fs.writeFile(file, text, (error) => { 
      
        // In case of a error throw err exception. 
        if (error) throw err; 
    }) 
}
