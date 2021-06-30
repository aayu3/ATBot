// function to sanitize msgs and return an array of commands and arguments
// returns 0 if the message is not a command
// i.e `!mute @jeff` becomes ['mute', 'jeff'];
const prefix = "!";

function sanitizeCommand(msg) {
    if (!msg.content.startsWith(prefix)) return 0;
    let sanitized = msg.content.replace(prefix,'');
    return sanitized.split(" ");
}


const rateDistribution = [3, 35, 62];
const rarities = ['UR', 'SR', 'Rare'];
const guaranteeRate = [3, 35];
const guaranteeRarities = ['UR', 'SR'];


const rarityEmoteDict = {'UR' : "<:UR:824486578273255424>", 'SR' : "<:SR:824486914065301514>", 'Rare' : "<:rare:824486578247172106>"};

function randomSelect(distribution, items) {
  if (distribution.length != items.length) {
    throw "incompatible sizes";
  } else {
    let arr = [];
    for (var i = 0; i < distribution.length; i++) {
      let numEl = distribution[i];
      let curEl = items[i];
      for (var j = 0; j < numEl; j++) {
        arr.push(curEl);
      }
    }
    return arr[Math.floor(Math.random() * arr.length)];
  }
  
}

async function printRolls(rarities, items, msg) {
  if (rarities.length != items.length) {
    throw "Incompatible length";
  }
  let rollMsg;
  let rollText = "__Premium Gacha__\n";
  for (var i = 0; i < rarities.length; i++) {
    let rarity = rarities[i];
    rollText = rollText + rarityEmoteDict[rarity] + "\n";
  }
  rollMsg = await msg.channel.send(rollText);


  let revealText = "__Premium Gacha__";
  for (var j = 0; j < rarities.length; j++) {
    if (items[j].hasOwnProperty("Particle")) {
      revealText = revealText + "\n" + rarityEmoteDict[rarities[j]] + " " +  items[j].Name + "\nhttps://actiontaiman.in/weapon_images/" + items[j].Icon;
    } else {
      revealText = revealText + "\n"  + rarityEmoteDict[rarities[j]] + " " +  items[j].Name + "\nhttps://actiontaiman.in/supporter_images/" + items[j].Icon + ".png";
    }
    
  }
  for (var k = i + 1; k < rarities.length; k++) {
    revealText = revealText + "\n" + rarityEmoteDict[rarities[k]];
  }
  console.log(revealText);
  setTimeout(() => {
    rollMsg.edit(revealText);
    // Wait 3 seconds
  }, 3000);
  
}

function generateGachaChoices(supporters, weapons) {
  var gachaDict = {'Normal': [], 'Rare' : [], 'SR' : [], 'UR' : []};
  for (var i = 0; i < supporters.length; i++) {
    let support = supporters[i];
    if (support.Source === "Standard Gacha") {
      gachaDict[support.Rarity].push(support);
    } 
  }
  for (var j = 0; j < weapons.length; j++) {
    let weapon = weapons[j];
    if (weapon.Source === "Standard Gacha") {
      gachaDict[weapon.Rarity].push(weapon);
    }
  }
  return gachaDict;
}

module.exports = {
    name: 'premiumgacha',
    description : "Roll premium gacha X times.",
    execute(msg, supporters, weapons, args) {
      let messageContents = sanitizeCommand(msg);
      if (messageContents[0] == "premiumgacha") {
        let numRolls = parseInt(messageContents[1]);
        if (numRolls < 1 || numRolls > 10) {
          msg.reply("You can only roll between 1 and 10 times");
        } else {
          // In this case no guaranteed SR
          if (numRolls < 10) {
            let rollRarities = [];
            let rollItems = [];
            let gachaChoices = generateGachaChoices(supporters, weapons);
            for (var i = 0; i < numRolls; i++) {
              let selectedRoll = randomSelect(rateDistribution, rarities);
              let selectedSet = gachaChoices[selectedRoll];
              let selectedItem = selectedSet[Math.floor(Math.random() * selectedSet.length)];
              rollRarities.push(selectedRoll);
              rollItems.push(selectedItem);
            }
            printRolls(rollRarities, rollItems, msg);
          } else {
            let rollRarities = [];
            let rollItems = [];
            let gachaChoices = generateGachaChoices(supporters, weapons);

            // Guaranteed SR or above
            let selectedRoll = randomSelect(guaranteeRate, guaranteeRarities);
            let selectedSet = gachaChoices[selectedRoll];
            let selectedItem = selectedSet[Math.floor(Math.random() * selectedSet.length)];
            rollRarities.push(selectedRoll);
            rollItems.push(selectedItem);
            for (var i = 0; i < numRolls - 1; i++) {
              let selectedRoll = randomSelect(rateDistribution, rarities);
              let selectedSet = gachaChoices[selectedRoll];
              let selectedItem = selectedSet[Math.floor(Math.random() * selectedSet.length)];
              rollRarities.push(selectedRoll);
              rollItems.push(selectedItem);
            }
            printRolls(rollRarities, rollItems, msg);
          }
        }
      }
    }
}

