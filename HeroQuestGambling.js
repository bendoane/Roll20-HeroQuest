
var hqCONSTANTS = {
  gamble_COMMAND: "!g",
  HQ_DICE_RED: {
    SKULL: "http://i.imgur.com/4Ye1BDj.jpg",
    WSHIELD: "http://i.imgur.com/XQsimgu.jpg",
    BSHIELD: "http://i.imgur.com/PBt16sl.jpg",
  },
};

function rollLoadedDice(diceToRoll, who) {
  var DiceResults = {
    bShield: 0,
    wShield: 0,
    skull: 0,
    diceGraphicsLog: "",
  };
  var DiceQty = diceToRoll[0].substring(1);

  DiceResults = rollLoadedHQDice(DiceQty);
  sendChat(who, "/me rolls combat dice");
  sendChat("", "/direct " + DiceResults.diceGraphicsLog);
  sendChat("", "Rolled " + DiceResults.wShield + " white shield(s)");
}

function rollLoadedHQDice(rollDiceQty) {
  var roll = 0;
  var i = 0;
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
    '" height=40 width=40/>')
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
      graphicsHTMLBuilder(diceColor.SKULL, "Skull");
    diceResult.skull = diceResult.skull + 1;
  }

  function LoadedRoll(roll, diceColor) {
    return {
      1: blackShieldOutput,
      2: skullOutput,
      3: whiteShieldOutput,
      4: whiteShieldOutput,
      5: whiteShieldOutput,
      6: whiteShieldOutput,
    }[roll](diceColor);
  }

  for (i = 1; i <= rollDiceQty; i++) {
    roll = randomInteger(6);
    LoadedRoll(roll, red);
  }
  return diceResult;
}

function processCommand(argv, who) {
  // This is a garbage way of doing this. ...it works, but it's gross.
  var script = argv.shift();
  switch (script) {
    case hqCONSTANTS.gamble_COMMAND:
      switch (argv[0]) {
        case "gamble":
          argv.shift();
          rollLoadedDice(argv,who);
          break;
        default:
          sendChat(who, "/direct input failure. Commands include: ");
      }
      break;
  }
};

on("chat:message", function (msg) {
  var chatCommand = msg.content.toLowerCase();

  var argv = chatCommand.split(" ");
  if (msg.type != "api") {
    return;
  }
  return processCommand(argv, msg.who); 
});