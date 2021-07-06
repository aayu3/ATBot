const fs = require('fs');
const request = require('request');

const url = "https://aayu3.github.io/ATBotJSONDependencies/supporters.json";

let options = {json: true};


let sup;
request(url, options, (error, res, body) => {
    if (error) {
        return  console.log(error)
    };

    if (!error && res.statusCode == 200) {
        sup = body;
        console.log(sup.Name);
    };
});
console.log(sup);
// Declare emotes for formatting
const suppressEmote = "<:suppress:824484622851112990>";
const protectEmote = "<:protect:824484622544404501>";
const assistEmote = "<:assist:824484622829355008>";
const rareEmote = "<:rare:824486578247172106>";
const srEmote = "<:SR:824486914065301514>";
const urEmote = "<:UR:824486578273255424>";



// Setting up FS variables
let rawdata = fs.readFileSync("supporters.json");
supporters = JSON.parse(rawdata);

module.exports = {
// parses all the files in the folder into JSON objects
    // prints supporter info before the image
    printSupporter: function (supporter) {
        // Name and Rarity Formatting
        let strRep = "**No. " + supporter.Number;
        strRep = strRep + " __" + supporter.Name + "__** \n**Rarity:** ";
        if (supporter.Rarity === "Rare") {
            strRep = strRep + rareEmote;
        } else if (supporter.Rarity == "SR") {
            strRep = strRep + srEmote;
        } else if (supporter.Rarity == "UR") {
            strRep = strRep + urEmote;
        }
        // Type formatting
        strRep = strRep + "\n**Type: **"
        if (supporter.Type === "Suppress") {
            strRep = strRep + suppressEmote;
        } else if (supporter.Type === "Protect") {
            strRep = strRep + protectEmote;
        } else if (supporter.Type === "Assist") {
            strRep = strRep + assistEmote;
        }
        // Source Formatting
        strRep = strRep + "\n**Source:** " + supporter.Source;

        // Check for Sub Skill then format it
        if (supporter.SkillName) {
            strRep = strRep + "\n**__Sub Skill: " + supporter.SkillName + "__**";
            let description = supporter.SkillDescription;
            description = description.replace(/ *\[[^\]]*]/g, ' ');
            description = description.trim();
            strRep = strRep + "\n" + description + ""; 
        }

        // Check for Main Skill then format it
        if (supporter.MainSkillName) {
            strRep = strRep + "\n**__Lead Skill: " + supporter.MainSkillName + "__**";
            if (supporter.CD) {
                strRep = strRep + " **CD:** " + supporter.CD + "s";  
            }
            let description = supporter.MainSkillDescription;
            description = description.replace(/ ?\[[^\]]*]/g, ' ');
            description = description.trim();
            description = description.replace(/  +/g, ' ');
            description = description.split('Passive : ').join('**Passive:** ');
            description = description.split(' Active : ').join('**Active:** ');
            console.log(description);
            strRep = strRep + "\n" + description + "";
            
        } else {
            strRep = strRep + "\n**This supporter has no activated skill.**"
        }
        
        return strRep
    },

    printMultiSupporters: function(supporters) {
        let strs = [];
        str = "";
        for (var i = 0; i < supporters.length; i++) {
            if (str.length <= 2000 && str.length >= 1900) {
                str = str.substring(0, str.length - 1);
                strs.push(str);
                str = "";
            }
            let sup = supporters[i];
            // add rarity at front
            if (sup.Rarity === "Rare") {
                str = str + rareEmote;
            } else if (sup.Rarity == "SR") {
                str = str + srEmote;
            } else if (sup.Rarity == "UR") {
                str = str + urEmote;
            }

            // add name
            str = str + " **" + sup.Name + "** ";

            // add type
            if (sup.Type === "Suppress") {
                str = str + suppressEmote;
            } else if (sup.Type === "Protect") {
                str = str + protectEmote;
            } else if (sup.Type === "Assist") {
                str = str + assistEmote;
            }
            str = str + "\n";
        }
        strs.push(str);
        return strs;
    },

    // assumes the input is legal
    searchByNumber: function (num, supporters) {
        return supporters[num-1];
    },

    filterByName: function(str, supporters) {
        let filtered = [];
        for (var i = 0; i < supporters.length; i++) {
            let sup = supporters[i];
            if (sup.hasOwnProperty("Name")) {
            if (sup.Name.toLowerCase().includes(str.toLowerCase())) {
                filtered.push(sup);
            }
        }
        }
        return filtered;
    },

    filterByRarity: function(rarity, supporters) {
        let filtered = [];
        for (var i = 0; i < supporters.length; i++) {
            let sup = supporters[i];
            if (sup.hasOwnProperty("Rarity")) {
            if (sup.Rarity.toLowerCase() === rarity.toLowerCase()) {
                filtered.push(sup);
            }
        }
        }
        return filtered;
    },

    filterByType: function (type, supporters) {
        let filtered = [];
        for (var i = 0; i < supporters.length; i++) {
            let sup = supporters[i];
            if (sup.hasOwnProperty("Type")) {
            if (sup.Type.toLowerCase() === type.toLowerCase()) {
                filtered.push(sup);
            }
        }
        }
        return filtered;
    },
    
    filterBySource: function (source, supporters) {
        let filtered = [];
        for (var i = 0; i < supporters.length; i++) {
            let sup = supporters[i];
            if (sup.hasOwnProperty("Source")) {
            if (sup.Source.toLowerCase().includes(source.toLowerCase())) {
                filtered.push(sup);
            }
        }
        }
        return filtered;
    }
}
