var scoreState = function () {

};

scoreState.prototype = {
    init: function() {
        this.endFadeIn = null;
    },

    preload: function() {
    },

    create: function() {

        this.textConfig = {
            font: "60px Arial",
            fill: "#E8EAF6",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 600
        };

        var text = game.winner.faction + " wins!";

        this.currentText = game.add.text(
            game.world.centerX,
            game.world.centerY,
            text.toUpperCase(),
            this.textConfig
        );

        this.currentText.anchor.set(0.5);

        this.endFadeIn = this.game.add.tween(this.game.world).to( { alpha: 1 }, 2000, "Linear", true );

        this.endFadeIn.onComplete.add(function (sprite, animation) {
            this.fadeExit = this.game.add.tween(this.game.world)
                                          .to( { alpha: 0 }, 300, "Linear", true );
            this.fadeExit.onComplete.add(function(){
                game.state.start("Menu");
            }, this);
        }, this);
    },


    update: function() {
    }
};
