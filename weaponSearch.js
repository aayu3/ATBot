const fs = require('fs');
const request = require('request');

const url = "https://aayu3.github.io/ATBotJSONDependencies/weapons.json";

let options = {json: true};


let wep;
request(url, options, (error, res, body) => {
    if (error) {
        return  console.log(error)
    };

    if (!error && res.statusCode == 200) {
        wep = body;
        console.log(wep.Name);
    };
});
console.log(wep);
// Declare emotes for formatting

const rareEmote = "<:rare:824486578247172106>";
const srEmote = "<:SR:824486914065301514>";
const urEmote = "<:UR:824486578273255424>";
const normalEmote = "<:normal:853495141541347328>";
const particleEmote = "<:particle:853495036175843369>"

// Setting up FS variables

module.exports = {
// parses all the files in the folder into JSON objects
    // prints supporter info before the image
    printWeapon: function (weapon) {
        // Name and Rarity Formatting
        let strRep = "**No. " + weapon.Number;
        strRep = strRep + " __" + weapon.Name + "__** ";
        strRep = strRep + "\n**Source:** " + weapon.Source + "\n**Rarity:** ";
        if (weapon.Rarity === "Normal") {
            strRep = strRep + normalEmote;
        }
        else if (weapon.Rarity === "Rare") {
            strRep = strRep + rareEmote;
        } else if (weapon.Rarity == "SR") {
            strRep = strRep + srEmote;
        } else if (weapon.Rarity == "UR") {
            strRep = strRep + urEmote;
        }
        strRep = strRep + "\n**Character:** " + weapon.Character;
        // Source Formatting
        strRep = strRep + "\n**Source:** " + weapon.Source;

        // Attack and Crit Formatting
        /*"MaxForgeAttack":504,
          "MaxForgeCrit":504,
          "MaxSLVLAttack":756,
          "MaxSLVLCrit":756, */
        strRep = strRep + "\n**Maximum Forge Attack: **" + weapon.MaxForgeAttack;
        strRep = strRep + "\n**Maximum Forge Crit: **" + weapon.MaxForgeCrit;
        strRep = strRep + "\n**Maximum SLVL Attack: **" + weapon.MaxSLVLAttack;
        strRep = strRep + "\n**Maximum SLVL Crit: **" + weapon.MaxSLVLCrit;

        // Check for Main Skill then format it
        if (weapon.SkillDescription) {
            let description = weapon.SkillDescription;
            if (description.split("N/A").length > 1) {
                return strRep;
            } else {
                strRep = strRep + "\n**Skill Name: **" + weapon.SkillName;
                if (weapon.Particle != -1) {
                    strRep = strRep + "\n**Particle Cost: **" + particleEmote + " x " + Math.floor(weapon.Particle/100);
                }
                description = description.replace(/ *\[[^\]]*]/g, ' ');
                description = description.trim();
                description = description.split("  ").join(" ");
                description = description.split("Passive : ").join("**Passive:** ");
                description = description.split(" Active : ").join("**Active:** ");
                console.log(description);
                strRep = strRep + "\n**__Skill Description: __**\n" + description ;

            }
        }

        
        return strRep
    },

    printMultiWeapons: function(weapons) {
        let strs = [];
        str = "";
        for (var i = 0; i < weapons.length; i++) {
            if (str.length <= 2000 && str.length >= 1900) {
                str = str.substring(0, str.length - 1);
                strs.push(str);
                str = "";
            }
            let weapon = weapons[i];
            // add rarity at front
            if (weapon.Rarity === "Normal") {
                str = str + normalEmote;
            }
            else if (weapon.Rarity === "Rare") {
                str = str + rareEmote;
            } else if (weapon.Rarity == "SR") {
                str = str + srEmote;
            } else if (weapon.Rarity == "UR") {
                str = str + urEmote;
            }

            // add name
            str = str + " **" + weapon.Name + "** ";

            // add type
           str = str + weapon.Character;
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

    filterByCharacter: function (character, supporters) {
        let filtered = [];
        for (var i = 0; i < supporters.length; i++) {
            let sup = supporters[i];
            if (sup.hasOwnProperty("Character")) {
            if (sup.Character.toLowerCase().includes(character.toLowerCase())) {
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
