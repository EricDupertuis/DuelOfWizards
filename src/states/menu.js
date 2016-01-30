var menuState = function () {

};

menuState.prototype = {
    init: function() {
        this.cursors = null;
        this.goKey = null;
        this.menuEntries = [];
        this.background = null;
        this.menuEntries.startText = null;
        this.menuEntries.infoText = null;
    },

    preload: function() {
        game.load.baseURL = 'assets/';
        this.load.image('fog','fog.png');
    },

    create: function() {
        this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'fog');
        this.background.scale.setTo(2, 2);
        this.background.autoScroll(-20, 0);

        this.startText = game.add.text(
            game.world.centerX,
            250,
            'Insert Game Title Here',
            { font: "35px Arial", fill: "#000", align: "center" }
        );

        this.startText.anchor.set(0.5);

        this.infoText = game.add.text(
            game.world.centerX,
            350,
            'Insert Game Title Here',
            { font: "35px Arial", fill: "#000", align: "center" }
        );

        this.infoText.anchor.set(0.5);

        this.goKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.cursors = this.input.keyboard.createCursorKeys();
    },

    update: function() {
        /*
        if (this.goKey.justDown) {
            this.game.state.start("Game");
        }
        */

        if (this.cursors.up.justDown) {

        } else if (this.cursors.down.justDown) {

        }
    }
};
