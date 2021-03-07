const fs = require('fs');

function fetchName(path) {
    return fs.readdirSync(path); 
}

let path = "taimanin_emotes";
let emoteNames = fetchName(path);
emoteNames.forEach((file) => { 
    console.log("File:", file); 
}); 