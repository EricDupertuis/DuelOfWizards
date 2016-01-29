var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example');

var PhaserGame = function () {
    this.config = null;
    this.players = [];
    this.players[0] = [];
    this.players[1] = [];
    this.currentPlayer = null;

    this.players[0].keys = [];
    this.players[1].keys = [];
    this.players[0].hand = this.dealHand();
    this.players[1].hand = this.dealHand();
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

    update: function () {
        this.currentPlayer.keys.forEach(function(entry, i){
            if (entry.justDown) {
                this.currentPlayer.chosenAttack = i;
                this.currentPlayer = this.otherPlayer(this.currentPlayer);
            }
        }, this);

        // Clear otherPlayer key presses because Phaser is retarded
        this.otherPlayer(this.currentPlayer).keys.forEach(function(entry, i){
            entry.justDown;
        }, this);

        if (this.players[0].chosenAttack != null && this.players[1].chosenAttack != null) {
            console.log("Chosen attacks: " + this.players[0].hand[this.players[0].chosenAttack] + ' ' + this.players[1].hand[this.players[1].chosenAttack]);
            this.players[0].chosenAttack = null;
            this.players[1].chosenAttack = null;
        }
    },

    otherPlayer: function(player) {
      if (player == this.players[0]) {
          return this.players[1];
      } else {
          return this.players[0];
      }
    },

    dealHand: function () {
        var result = [];
        for(var i = 0;i < 4; i++) {
            result[i] = Math.floor((Math.random() * 10) + 1);
        }
        return result;
    }
};

game.state.add('phaser-example', PhaserGame, true);
