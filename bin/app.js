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

    this.deck = [1, 2, 3, 4, 5];
};


PhaserGame.prototype = {
    init: function () {
        game.load.json('config', 'config/config.json');

        //Register main keys
        this.players[0].keys[0] = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.players[0].keys[1] = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.players[0].keys[2] = game.input.keyboard.addKey(Phaser.Keyboard.E);
        this.players[0].keys[3] = game.input.keyboard.addKey(Phaser.Keyboard.T);

        this.players[1].keys[0] = game.input.keyboard.addKey(Phaser.Keyboard.Y);
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

    },

    debugState: function () {
        console.log("Deck: " + this.deck);
        console.log("Player 0's hand: " + this.players[0].hand);
        console.log("Player 1's hand: " + this.players[1].hand);
    },

    update: function () {
        this.currentPlayer.keys.forEach(function(entry, i){
            if (entry.justDown) {
                if (i < this.deck.length) {
                    this.currentPlayer.hand.push(this.deck[i]);
                    this.deck.splice(i, 1);
                    this.currentPlayer = this.otherPlayer(this.currentPlayer);
                    this.debugState();
                }
            }
        }, this);

        // Clear otherPlayer key presses because Phaser is retarded
        this.otherPlayer(this.currentPlayer).keys.forEach(function(entry, i){
            entry.justDown;
        }, this);

        if (this.deck.length == 0) {
            this.debugState();
        }
    },

    otherPlayer: function(player) {
      if (player == this.players[0]) {
          return this.players[1];
      } else {
          return this.players[0];
      }
    },
};

game.state.add('phaser-example', PhaserGame, true);
