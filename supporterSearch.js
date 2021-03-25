const fs = require('fs');

// Declare emotes for formatting
const suppressEmote = "<:suppress:824484622851112990>";
const protectEmote = "<:protect:824484622544404501>";
const assistEmote = "<:assist:824484622829355008>";
const rareEmote = "<:rare:824486578247172106>";
const srEmote = "<:SR:824486914065301514>";
const urEmote = "<:UR:824486578273255424>";

// Setting up FS variables
let supporterPath = "supporter_json";
let supporterJSONs = fs.readdirSync(supporterPath);

// parses all the files in the folder into JSON objects
export function parseJSON (folder) {
    var supporters = [];
    for (var i = 0; i < folder.length; i++) {
        let rawdata = fs.readFileSync(supporterPath + "/" + folder[i]);
        let sup = JSON.parse(rawdata);
        supporters.push(sup);
    }
    return supporters;
}

// prints supporter info before the image
export function printSupporter(supporter) {
    // Name and Rarity Formatting
    let strRep = "**No. " + supporter.Number;
    strRep = strRep + " __" + supporter.Name + "__** \n**Rarity:** ";
    if (supporter.Rarity === "R") {
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

    // Check for Main Skill then format it
    if (supporter.MainSkillName) {
        strRep = strRep + "\n**Lead Skill: __" + supporter.MainSkillName + "__**";
        if (supporter.CD) {
            strRep = strRep + "\n**Active Skill:**\n" + "*" + supporter.MainSkillActive + "*";
            strRep = strRep + "\n**Cooldown:** " + supporter.CD + " seconds";
        }
        if (supporter.MainSkillPassive) {
            strRep = strRep + "\n**Passive Skill:**\n" + "*" + supporter.MainSkillPassive + "*";
        }
    }
    // Check for Sub Skill then format it
    if (supporter.SubSkillName) {
        strRep = strRep + "\n**Sub Skill:** __" + supporter.SubSkillName + "__";
        strRep = strRep + "\n*" + supporter.SubSkill + "*"; 
    }
    return strRep
}

// assumes the input is legal
export function searchByNumber(num, supporters) {
    return supporters[num-1];
}

let supporters = parseJSON(supporterJSONs);
console.log(printSupporter(supporters[52]));
