var STATE_INIT = "init";
var STATE_PICK = "pick";
var STATE_ORDER = "order";
var STATE_COMBAT = "combat";
var STATE_WON = "won";

var FACTIONS = ["Faction0", "Faction1"];

// Effect is a function taking player and opponent card as parameters
createCard = function(name, faction, effect) {
    res =  {
        "name": name,
        "faction": faction,
        "effect": effect
    };

    res.effect = _.bind(effect, res);

    return res;
};

var powerLevelCardEffect = function (player, opponent, opponentCard) {
    if (player.faction == this.faction) {
        player.score.powerLevel += 2;
    } else {
        player.score.powerLevel += 1;
    }
};

var attackEffect = function(player, opponent, opponentCard) {
    console.log(this.name, DEFENSE_CARDS.indexOf(opponentCard));
    if (DEFENSE_CARDS.indexOf(opponentCard) != -1) {
        return;
    }

    if (player.faction == this.faction) {
        opponent.score.powerLevel -= 3;
    } else {
        opponent.score.powerLevel -= 2;
    }

    if (opponent.score.powerLevel < 0) {
        opponent.score.powerLevel = 0;
    }
};

var defenseEffect = function (player, opponent, opponentCard) {
    if (ATTACK_CARDS.indexOf(opponentCard) == -1) {
        return;
    }
    if (player.faction == this.faction) {
        player.score.powerLevel += 2;
    } else {
        player.score.powerLevel += 1;
    }
};

var jockerEffect = function (player, opponent, opponentCard) {
    newcard = _.sample(DECK, 1)[0];
    console.log("Joker: " + newcard.name);
    newcard.effect(player, opponent, opponentCard);
};


DEFENSE_CARDS = [
    createCard("Team0 defense", FACTIONS[0], defenseEffect),
    createCard("Team1 defense", FACTIONS[1], defenseEffect),
    createCard("neutral defense", "", defenseEffect)
];

ATTACK_CARDS = [
    createCard("Team0 attack", FACTIONS[0], attackEffect),
    createCard("Team1 attack", FACTIONS[1], attackEffect),
    createCard("neutral attack", "", attackEffect)
];

DECK = ATTACK_CARDS.concat(DEFENSE_CARDS.concat([
    createCard("Team0 up", FACTIONS[0], powerLevelCardEffect),
    createCard("Team1 up", FACTIONS[1], powerLevelCardEffect),
    createCard("neutral up", "", powerLevelCardEffect),
    createCard("Joker", "", jockerEffect),
]));


var gameScore = function() {
    this.powerLevel = 2;
    this.hasArtifact = true;
};

var gameState = function () {
    this.config = null;
    this.players = [];
    this.players[0] = [];
    this.players[1] = [];
    this.currentPlayer = null;

    this.players.forEach(function(player) {
        player.keys = [];
        player.score = new gameScore();
    });

    this.booster = null;

    this.deck = DECK;
};


gameState.prototype = {
    init: function () {
        //Register main keys
        // TODO: add 5th card
        this.players[0].keys[0] = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.players[0].keys[1] = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.players[0].keys[2] = game.input.keyboard.addKey(Phaser.Keyboard.E);
        this.players[0].keys[3] = game.input.keyboard.addKey(Phaser.Keyboard.T);

        this.players[1].keys[0] = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.players[1].keys[1] = game.input.keyboard.addKey(Phaser.Keyboard.U);
        this.players[1].keys[2] = game.input.keyboard.addKey(Phaser.Keyboard.I);
        this.players[1].keys[3] = game.input.keyboard.addKey(Phaser.Keyboard.O);

        this.players[0].chosenAttack = null;
        this.players[1].chosenAttack = null;

        this.currentPlayer = this.players[0];

        this.gameState = STATE_INIT;

        this.players[0].faction = FACTIONS[0];
        this.players[1].faction = FACTIONS[1];
    },

    preload: function () {
    },

    create: function () {
    },

    debugState: function () {
        prettyCards = function(p) {
            return _.map(p, function (c) {return c.name}).join();
        };

        console.log("State: " + this.gameState);
        console.log("Deck: " + prettyCards(this.deck));
        console.log("Booster: " + prettyCards(this.booster));
        console.log("Player 0's hand: " + prettyCards(this.players[0].hand));
        console.log("Player 1's hand: " + prettyCards(this.players[1].hand));

        console.log("Player 0's combat set: " + prettyCards(this.players[0].combatOrderedHand));
        console.log("Player 1's combat set: " + prettyCards(this.players[1].combatOrderedHand));

        console.log("Player 1 score: " + this.players[0].score.powerLevel);
        console.log("Player 2 score: " + this.players[1].score.powerLevel);
    },


    clearAllKeypresses: function() {
        this.players.forEach(function (player) {
            player.keys.forEach(function (entry, i) {
                entry.justDown;
            }, this);
        }, this);
    },

    handleInitPhase: function() {
        this.players.forEach(function(player) {
            player.hand = [];
            player.combatOrderedHand = [];
        });
        this.booster = this.createBooster(this.deck);
        this.gameState = STATE_PICK;
        this.debugState();

    },

    handlePickPhase: function () {
        this.currentPlayer.keys.forEach(function (entry, i) {
            if (entry.justDown) {
                if (i < this.booster.length) {
                    this.currentPlayer.hand.push(this.booster[i]);
                    this.booster.splice(i, 1);
                    this.currentPlayer = this.otherPlayer(this.currentPlayer);
                    this.debugState();
                }
            }
        }, this);

        if (this.booster.length <= 1) {
            this.gameState = STATE_ORDER;
        }
    },

    handleOrderPhase: function() {
        this.currentPlayer.keys.forEach(function (entry, i) {
            if (entry.justDown) {
                if (i < this.currentPlayer.hand.length) {
                    this.currentPlayer.combatOrderedHand.push(this.currentPlayer.hand[i]);
                    this.currentPlayer.hand.splice(i, 1);
                    this.debugState();
                }
            }
        }, this);


        /* If the hand is empty switch to other player. If both hands are
         * empty, switch to combat phase. */
        if (this.currentPlayer.hand.length == 0) {
            if (this.otherPlayer(this.currentPlayer).hand.length == 0) {
                this.gameState = STATE_COMBAT;
            } else {
                this.currentPlayer = this.otherPlayer(this.currentPlayer);
            }
        }
    },

    handleCombatPhase: function() {
        _.map(_.zip(this.players[0].combatOrderedHand, this.players[1].combatOrderedHand), function(a) {
            a[0].effect(this.players[0], this.players[1], a[1]);
            a[1].effect(this.players[1], this.players[0], a[0]);

            _.map(this.players, function(player) {
                if (this.checkVictory(player)) {
                    console.log(player.faction + " wins");
                    this.gameState = STATE_WON;
                }
            }, this);
        }, this);

        this.debugState();

        if (this.gameState != STATE_WON) {
            this.gameState = STATE_INIT;
        }
    },

    update: function () {
        if(this.gameState == STATE_INIT) {
            this.handleInitPhase();
        } else if (this.gameState == STATE_PICK) {
            this.handlePickPhase();
        } else if (this.gameState == STATE_ORDER) {
            this.handleOrderPhase();
        } else if (this.gameState == STATE_COMBAT) {
            this.handleCombatPhase();
        } else {
            console.log("Unknown state: " + this.gameState);

        }

        this.clearAllKeypresses();
    },

    otherPlayer: function (player) {
        if (player == this.players[0]) {
            return this.players[1];
        } else {
            return this.players[0];
        }
    },

    createBooster: function (deck) {
        return _.sample(deck, 5);
    },

    // return true if given player wins
    checkVictory: function (player) {
        return player.score.powerLevel >= 6 && player.score.hasArtifact;
    }
};