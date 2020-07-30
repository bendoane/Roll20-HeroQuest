//Hero Quest Dice Mechanics 2.0
// 2.0 version upgraded by Ben Doane (resident Zargon the Almighty)
//---------------------------------------
// Syntax for use with Roll20:
//---------------------------------------
// !hq test
//        Outputs every side of every die to the chat window.

// !hq graphics < small | medium | large >
//        default:on and m
//        Shows dice rolled as graphic, small, medium, or large

// !hq attack h<#>
// !hq attack m<#>
//        Either a hero (h) or a monster (m) single attack roll. The '#' should be replaced with the number of dice rolling.

// !hq defend h<#>
// !hq defend m<#>
//        Either a hero (h) or a monster (m) single defend roll. The '#' should be replaced with the number of dice rolling.

// --------------------------------------

var hqCONSTANTS = {
  HQ_COMMAND: "!hq",
  GRAPHIC_SIZE: {
    SMALL: 20,
    MEDIUM: 40,
    LARGE: 60,
  },
  HQ_DICE_WHITE: {
    SKULL: "http://i.imgur.com/JZfuoZr.jpg",
    WSHIELD: "http://i.imgur.com/fk5nuTh.jpg",
    BSHIELD: "http://i.imgur.com/7J2SZzF.jpg",
  },
  HQ_DICE_RED: {
    SKULL: "http://i.imgur.com/4Ye1BDj.jpg",
    WSHIELD: "http://i.imgur.com/XQsimgu.jpg",
    BSHIELD: "http://i.imgur.com/PBt16sl.jpg",
  },
  ENEMY_DEFEATED_NARRATION_START: {
    1: "adds one to the body bag",
    2: "vanquishes the foe",
    3: "is just getting warmed up",
    4: "takes 'em down",
    5: "finishes off the beast",
    6: "is here to fuck shit up",
    7: "came to party",
    8: "is hungry for more",
    9: "does a victory jig",
    10: "saves the day",
    11: "kicks some ass",
    12: "is taking names with kills like these",
    13: "is showing their worth",
    14: "wasn't impressed",
    15: "reigns supreme",
    16: "is bringing the heat",
    17: "slapped a bitch",
    18: "showed 'em what's what",
    19: "adds one to the body bag",
    20: "adds one to the body bag",
  },
  ENEMY_DEFEATED_NARRATION_END: {
    1: "laughing at the corpse of the fallen foe.",
    2: "punching the air in a show of victory.",
    3: "looking around for someone to high five.",
    4: "grinning with pride.",
    5: "shouting 'Woo!', like Rick Flair.",
    6: "giving the finger to the other heroes.",
    7: "with arms out, asking 'Are you not entertained!?'",
    8: "shouting out 'come get some!'",
    9: "looking for the next victim.",
    10: "hoping someone else saw that awesome kill.",
    11: "and isn't ready to back down.",
    12: "huzzah!",
    13: "fuck yeah...",
    14: "saying under their breath, 'how do you like THEM apples?'",
    15: "saying 'I guess we chose the hard way.'",
    16: "wondering if this is all Zargon can bring.",
    17: "wondering where the help from the gang was on THAT??",
    18: "pelvic thrusting and saying 'Awwwwww yeaaaahhh...'",
  },
};

var hqGlobal = {
  diceGraphicsChatSize: hqCONSTANTS.GRAPHIC_SIZE.MEDIUM,
  diceTestEnabled: false,
};

function rollHQDice(rollDiceQty, characterType, who) {
  var roll = 0;
  var i = 0;
  var white = hqCONSTANTS.HQ_DICE_WHITE;
  var red = hqCONSTANTS.HQ_DICE_RED;
  var diceResult = {
    bShield: 0,
    wShield: 0,
    skull: 0,
    diceGraphicsLog: "",
  };

  function graphicsHTMLBuilder(diceImage, imageName) {
    return (
    '<img src="' +
    diceImage +
    '" title="' +
    imageName +
    '" height="' +
    hqGlobal.diceGraphicsChatSize +
    '" width="' +
    hqGlobal.diceGraphicsChatSize +
    '"/>')
  }

  function blackShieldOutput(diceColor) {
    diceResult.diceGraphicsLog =
      diceResult.diceGraphicsLog +
      graphicsHTMLBuilder(
        diceColor.BSHIELD,
        "Black Shield"
      );
    diceResult.bShield = diceResult.bShield + 1;
  }

  function whiteShieldOutput(diceColor) {
    diceResult.diceGraphicsLog =
      diceResult.diceGraphicsLog +
      graphicsHTMLBuilder(diceColor.WSHIELD, "White Shield");
    diceResult.wShield = diceResult.wShield + 1;
  }

  function skullOutput(diceColor) {
    diceResult.diceGraphicsLog =
      diceResult.diceGraphicsLog +
      graphicsHTMLBuilder(diceColor.SKULL, "SKull");
    diceResult.skull = diceResult.skull + 1;
  }

  function CombatRoll(roll, diceColor) {
    return {
      1: blackShieldOutput,
      2: skullOutput,
      3: skullOutput,
      4: skullOutput,
      5: whiteShieldOutput,
      6: whiteShieldOutput,
    }[roll](diceColor);
  }

  for (i = 1; i <= rollDiceQty; i++) {
    if (hqGlobal.diceTestEnabled === true) {
      roll = roll + 1;
    } else {
      roll = randomInteger(6);
    }

    if (characterType === "h") {
      CombatRoll(roll, white);
    } else {
      CombatRoll(roll, red);
    }
  }
  return diceResult;
}

function singleCharacterAttackRoll(diceToRoll, who) {
  var DiceResults = {
    bShield: 0,
    wShield: 0,
    skull: 0,
    diceGraphicsLog: "",
  };
  var CharacterType = diceToRoll[0].substring(0, 1);
  var DiceQty = diceToRoll[0].substring(1);

  DiceResults = rollHQDice(DiceQty, CharacterType, who);
  sendChat(who, "/me rolls combat dice");
  sendChat("", "/direct " + DiceResults.diceGraphicsLog);
  sendChat("", "Rolled " + DiceResults.skull + " skulls");
}

function singleCharacterDefendRoll(diceToRoll, who) {
  var DiceResults = {
    bShield: 0,
    wShield: 0,
    skull: 0,
    diceGraphicsLog: "",
  };
  var CharacterType = diceToRoll[0].substring(0, 1);
  var DiceQty = diceToRoll[0].substring(1);

  DiceResults = rollHQDice(DiceQty, CharacterType, who);
  sendChat(who, "/me rolls combat dice");
  sendChat("", "/direct " + DiceResults.diceGraphicsLog);

  function singleCombatRollText(CharacterType) {
    var whiteShieldsRolled = DiceResults.wShield;
    var blackShieldsRolled = DiceResults.bShield;

    switch (CharacterType) {
      case "h":
        sendChat("", "Rolled " + whiteShieldsRolled + " white shield(s)");
        break;
      case "m":
        sendChat("", "Rolled " + blackShieldsRolled + " black shield(s)");
        break;
    }
  }

  singleCombatRollText(CharacterType);
}


function attackAndDefendCombatResults(diceToRoll, who) {
  var attackDiceResults = {
    bShield: 0,
    wShield: 0,
    skull: 0,
    diceGraphicsLog: "",
  };
  var defendDiceResults = {
    bShield: 0,
    wShield: 0,
    skull: 0,
    diceGraphicsLog: "",
  };

  var attacker = diceToRoll[0].substring(0, 1);
  var attackerDiceQty = diceToRoll[0].substring(1);
  attackDiceResults = rollHQDice(attackerDiceQty, attacker, who);

  var defender = diceToRoll[1].substring(0, 1);
  var defenderDiceQty = diceToRoll[1].substring(1);
  defendDiceResults = rollHQDice(defenderDiceQty, defender, who);

  if (hqGlobal.diceTestEnabled === true) {
    sendChat("", "/desc " + who + ": h1 m1");
  } else {
    if (hqGlobal.diceLogChatWhisper === true) {
      sendChat(who, "/w gm " + diceToRoll);
      sendChat(who, "/w " + who + " " + diceToRoll);
    } else {
      sendChat(who, "/me " + diceToRoll);
    }
  }

  sendChat("", "/direct " + attackDiceResults.diceGraphicsLog);
  sendChat("", "/direct " + defendDiceResults.diceGraphicsLog);

  function dualCombatResult(attacker) {
    var heroDamageDealt = attackDiceResults.skull - defendDiceResults.bShield;
    var monsterDamageDealt = attackDiceResults.skull - defendDiceResults.wShield;
    if (heroDamageDealt < -1) heroDamageDealt = -1; // Critical Failure of a Hero
    if (monsterDamageDealt < -2) monsterDamageDealt = -1; // Critical Failure of a Monster

    switch (attacker) {
      case "h":
        sendChat("", "Hero does " + heroDamageDealt + " damage");
        break;
      case "m":
        sendChat("", "Monster does " + monsterDamageDealt + " damage");
        break;
    }
  }

  dualCombatResult(attacker);
}

function changeDiceImgSize(imageSize, who) {
  var size = imageSize.toUpperCase();
  var options = ['SMALL', 'MEDIUM', 'LARGE'];
  if (options.indexOf(size) === -1) {
    return sendChat(who, "/w gm sizes must be 'small' 'medium' or 'large'. You entered " + imageSize);
  }

  hqGlobal.diceGraphicsChatSize = hqCONSTANTS.GRAPHIC_SIZE[size];
  sendChat(who, "/w gm roll dice graphics set to: " + size);
}

function generateEnemyDefeatedNarration(characterClassName, who) {
  if (characterClassName == null) {
    return sendChat(who, "/w gm you must enter a valid HQ Hero character class.");
  }
  var sentenceStart = hqCONSTANTS.ENEMY_DEFEATED_NARRATION_START[randomInteger(20)];
  var sentenceEnd = hqCONSTANTS.ENEMY_DEFEATED_NARRATION_END[randomInteger(18)];
  sendChat(who, "/me " + sentenceStart + ", " + sentenceEnd);
}


function processScriptTabs(argv, who) {
  // this will run the various other scripts depending upon the chat
  // window command.  Just add another Case statement to add a new command.

  var script = argv.shift();
  switch (script) {
    case hqCONSTANTS.HQ_COMMAND:
      switch (argv[0]) {
        case "attack":
          argv.shift();
          singleCharacterAttackRoll(argv, who);
          break;
        case "defend":
          argv.shift();
          singleCharacterDefendRoll(argv, who);
          break;
        case "kill":
          argv.shift(); // strip off "kill" from argv
          generateEnemyDefeatedNarration(argv[0], who);
          break;
        case "graphics":
          argv.shift(); // strip off "graphics" from argv
          changeDiceImgSize(argv[0], who) // send size
          break;
        case "test":
          hqGlobal.diceTestEnabled = true;
          attackAndDefendCombatResults(["h6", "m6"], who);
          hqGlobal.diceTestEnabled = false;
          break;
        default:
          sendChat(who, "/direct input failure. Commands include 'attack <(h/m)#>', 'defend <(h/m)#>', 'both <(h/m)#> <(h/m)#>', 'graphics <size>', and 'test'.");
      }
      break;
  }
};

on("chat:message", function (msg) {
  // returns the chat window command entered, all in lowercase.

  var chatCommand = msg.content;
  chatCommand = chatCommand.toLowerCase(); //make all characters lowercase

  var argv = chatCommand.split(" ");
  if (msg.type != "api") {
    return;
  }
  return processScriptTabs(argv, msg.who);
});
