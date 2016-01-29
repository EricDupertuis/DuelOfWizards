var menuState = function () {

};

menuState.prototype = {
    init: function() {
        this.startText = null;
        this.goKey = null;
    },

    preload: function() {

    },

    create: function() {
        this.startText = game.add.text(
            game.world.centerX,
            game.world.centerY,
            'Start Game',
            { font: "65px Arial", fill: "#ff0044", align: "center" }
        );

        this.startText.anchor.set(0.5);
        this.startText.inputEnabled = true;

        this.goKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);

    },

    update: function() {
        if (this.goKey.justDown) {
            this.game.state.start("Game");
        }
    }
};