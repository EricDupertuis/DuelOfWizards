var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example');

var PhaserGame = function () {
    this.config = null;
    this.players = [];
    this.players[0] = [];
    this.players[1] = [];
    this.currentPlayer = null;

    this.players[0].keys = [];
    this.players[1].keys = [];
    this.players[0].hand = [];
    this.players[1].hand = [];

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
    },

    preload: function () {
    },

    create: function () {
        this.booster = this.createBooster(this.deck);
        this.debugState();
    },

    debugState: function () {
        console.log("Deck: " + this.deck);
        console.log("Booster: " + this.booster);
        console.log("Player 0's hand: " + this.players[0].hand);
        console.log("Player 1's hand: " + this.players[1].hand);
    },

    update: function () {
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

        // Clear otherPlayer key presses because Phaser is retarded
        this.otherPlayer(this.currentPlayer).keys.forEach(function (entry, i) {
            entry.justDown;
        }, this);

        if (this.booster.length == 0) {
            this.debugState();
        }
    },

    otherPlayer: function (player) {
        if (player == this.players[0]) {
            return this.players[1];
        } else {
            return this.players[0];
        }
    },

    createBooster: function (deck) {
        return _.sample(deck, 10);
    }
};

game.state.add('phaser-example', PhaserGame, true);
