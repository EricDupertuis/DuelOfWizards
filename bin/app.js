var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example');

var PhaserGame = function () {
    this.config;
    this.players = [];
    this.players[0] = [];
    this.players[1] = [];
    this.combos = [];
    this.players[0].keys = [];
    this.players[1].keys = [];
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
    },

    preload: function () {
    },

    create: function () {

    },

    update: function () {
        this.players[0].keys.forEach(function(entry){
            if (entry.justDown) {
                console.log(entry);
            }
        });

        this.players[1].keys.forEach(function(entry){
            if (entry.justDown) {
                console.log(entry);
            }
        });
    }
};

game.state.add('phaser-example', PhaserGame, true);
