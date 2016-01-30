var menuState = function () {

};

menuState.prototype = {
    init: function () {
        this.cursors = null;
        this.goKey = null;
        this.menuEntries = [];
        this.background = null;
        this.menuEntries[0] = null;
        this.menuEntries[1] = null;
        this.selectedMenu = 0;
    },

    preload: function () {
        game.load.baseURL = 'assets/';
        this.load.image('fog', 'fog.png');
    },

    create: function () {
        this.goKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'fog');
        this.background.scale.setTo(2, 2);
        this.background.autoScroll(-20, 0);

        this.menuEntries[0] = game.add.text(
            game.world.centerX,
            250,
            'New Game',
            {font: "35px Arial", fill: "#000", align: "center"}
        );
        this.menuEntries[0].anchor.set(0.5);

        this.menuEntries[1] = game.add.text(
            game.world.centerX,
            350,
            'Game instructions',
            {font: "35px Arial", fill: "#000", align: "center"}
        );
        this.menuEntries[1].anchor.set(0.5);
    },

    update: function () {
        if (this.cursors.up.justDown) {
            if (this.selectedMenu > 0) {
                this.selectedMenu -= 1;
            }
        } else if (this.cursors.down.justDown) {
            if (this.selectedMenu < this.menuEntries.length - 1) {
                this.selectedMenu += 1;
            }
        }

        this.menuEntries.forEach(function (entry, i) {
            entry.alpha = 1;
            if (i != this.selectedMenu) {
                entry.alpha = DARKEN_ALPHA;
            }
        }, this);

        if (this.goKey.justDown) {
            if (this.selectedMenu == 0) {
                this.game.add.tween(this.game.world).to( { alpha: 0 }, 2000, "Linear", true);
                this.game.state.start("Game");
            } else {
                //@TODO Change for another state when ready
                console.log('Game instruction');
            }
        }
    }
};
