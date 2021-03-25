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

function parseJSON (folder) {
    var supporters = [];
    for (var i = 0; i < folder.length; i++) {
        let rawdata = fs.readFileSync(supporterPath + "/" + folder[i]);
        let sup = JSON.parse(rawdata);
        supporters.push(sup);
    }
    return supporters;
}

function printSupporter(supporter) {
    let strRepresentation = "**No. " + supporter.Number;
    strRepresentation = strRepresentation + " " + supporter.Name + "** ";
    if (supporter.Type === "")


}

parseJSON(supporterJSONs);
