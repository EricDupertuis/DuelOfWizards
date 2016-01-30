var endState = function () {

};

endState.prototype = {
    init: function() {
        this.text = null;
    },

    preload: function() {

    },

    create: function() {
        this.text= game.add.text(
            game.world.centerX,
            game.world.centerY,
            'Winner',
            { font: "65px Arial", fill: "#ff0044", align: "center" }
        );
        this.text.anchor.set(0.5);
    },

    update: function() {
        this.text.text = this.game.winner.faction + " wins!"
    }
};
