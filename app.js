var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example');

var PhaserGame = function () {
    this.player1 = null;
    this.player2 = null;
    this.combos = [];
    this.keys = [];
    this.turn = 1;
};


PhaserGame.prototype = {
    init: function () {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.keys.One = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        this.keys.Two = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        this.keys.Three = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    },

    preload: function () {

    },

    create: function () {
        console.log(this);
    },

    update: function () {
        if (this.keys.One.justDown) {
            console.log('1');
        } else if (this.keys.Two.justDown) {
            console.log('2');
        } else if (this.keys.Three.justDown) {
            console.log('3');
        }
    }
};

game.state.add('phaser-example', PhaserGame, true);
