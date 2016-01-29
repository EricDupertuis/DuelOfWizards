var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example');

var STATE_PICK = "pick";
var STATE_ORDER = "order";
var STATE_COMBAT = "combat";

var FACTIONS = ["Faction0", "Faction1"];

var PhaserGame = function () {
    this.config = null;
    this.players = [];
    this.players[0] = [];
    this.players[1] = [];
    this.currentPlayer = null;

    this.players.forEach(function(player) {
        player.keys = [];
        player.hand = [];
        player.combatOrderedHand = [];
    });

    this.booster = null;

    //Just temp to simulate deck shuffle
    this.deck = [];

    for (var i = 1; i <= 30; i++) {
        this.deck.push(i);
    }
};


PhaserGame.prototype = {
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

        this.gameState = STATE_PICK;

        this.players[0].faction = FACTIONS[0];
        this.players[1].faction = FACTIONS[1];
    },

    preload: function () {
    },

    create: function () {
        this.booster = this.createBooster(this.deck);
        this.debugState();
    },

    debugState: function () {
        console.log("State: " + this.gameState);
        console.log("Deck: " + this.deck);
        console.log("Booster: " + this.booster);
        console.log("Player 0's hand: " + this.players[0].hand);
        console.log("Player 1's hand: " + this.players[1].hand);

        console.log("Player 0's combat set: " + this.players[0].combatOrderedHand);
        console.log("Player 1's combat set: " + this.players[1].combatOrderedHand);
    },


    clearAllKeypresses: function() {
        this.players.forEach(function (player) {
            player.keys.forEach(function (entry, i) {
                entry.justDown;
            }, this);
        }, this);
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
            console.log("Fight between here and here: " + a);
        });

        this.gameState = "error";
    },

    update: function () {
        if (this.gameState == STATE_PICK) {
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
    }
};

game.state.add('phaser-example', PhaserGame, true);
