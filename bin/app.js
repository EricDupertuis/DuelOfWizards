var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example');

var PhaserGame = function () {
    this.config = null;
    this.players = [];
    this.players[0] = [];
    this.players[1] = [];
    this.combos = [];
    this.players[0].keys = [];
    this.players[1].keys = [];
    this.players[0].hand = this.dealHand();
    this.players[1].hand = this.dealHand();
    this.turn = 1;
};


PhaserGame.prototype = {
    init: function () {
        game.load.json('config', 'config/config.json');

        //Register main keys
        this.players[0].keys[0] = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.players[0].keys[1] = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.players[0].keys[2] = game.input.keyboard.addKey(Phaser.Keyboard.E);
        this.players[0].keys[3] = game.input.keyboard.addKey(Phaser.Keyboard.R);

        this.players[1].keys[0] = game.input.keyboard.addKey(Phaser.Keyboard.Y);
        this.players[1].keys[1] = game.input.keyboard.addKey(Phaser.Keyboard.U);
        this.players[1].keys[2] = game.input.keyboard.addKey(Phaser.Keyboard.I);
        this.players[1].keys[3] = game.input.keyboard.addKey(Phaser.Keyboard.O);

        this.players[0].chosenAttack = null;
        this.players[1].chosenAttack = null;
    },

    preload: function () {
    },

    create: function () {

    },

    update: function () {
        this.players.forEach(function(player) {
            player.keys.forEach(function(entry, i){
                if (entry.justDown) {
                    player.chosenAttack = i;
                }
            }, this);
        }, this);

        if (this.players[0].chosenAttack != null && this.players[1].chosenAttack != null) {
            console.log("Chosen attacks: " + this.players[0].hand[this.players[0].chosenAttack] + ' ' + this.players[1].hand[this.players[1].chosenAttack]);
            this.players[0].chosenAttack = null;
            this.players[1].chosenAttack = null;
            console.log(this.players[0].hand);
            console.log(this.players[1].hand);
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
