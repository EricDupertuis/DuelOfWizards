var instructionsState = function () {

};

instructionsState.prototype = {
    init: function() {
        this.textConfig = {
            font: "32px Arial",
            fill: "#E8EAF6",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 600
        };
        this.instructions = [];
        this.instructions[0] = "Choose who will be the player one.\ " +
            "To do so, you can measure the size of your beard and the longer begin. \I" +
            "f you are a woman you begin because we understand the fact you can't grow a beard.";
        this.instructions[1] = "The tour has three distinguish phases. \A" +
            " draft phase, a selection phase and a resolution phase.";
        this.instructions[2] = "The draft phase: During this phase, a booster of 5 cards will be available.\ " +
            "Player one chose one card among 5 cards than give the rest to Player two (4 cards).\ " +
            "Player two do the same,so he chose one card among 4 remaining cards than give the rest to player one.\ " +
            "We do exactly the same process once again and the last card is put in the discarding.\ " +
            "Players are not allowed to see the choice of other player during all the draft phase.";
        this.instructions[3] = "Selection phase: during this phase, both player have to chose the order of their cards resolution.\ " +
            "Player one will chose first and player two is not allowed to see player one's choice.\ " +
            "Than player two chose and player one is not allowed to see player two's choice.";
        this.instructions[4] = "Resolution phase, this phase will occur automatically as follows:\ " +
            "first card of player one will fight the first card of player two.\ " +
            "Then second card of player one will fight second card of player two.\ " +
            "After that, new scores will be automatically evaluated and cards played are put in the discarding.";
        this.instructions[5] = "A new booster will be created and this time the player who didn't begin will chose first and we restart phases.";
        this.instructions[6] = "When there is not enough cards to generate a booster, all cards will be shuffle together and a new booster will be available.\ " +
            "When your mana pool is full and you have completed your artefact, you win the game!";

        this.textCounter = 0;

        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

    preload: function() {
        game.load.baseURL = 'assets/';
        game.load.image('background', 'background.png');
    },

    create: function() {
        this.background = game.add.tileSprite(0, 0, game.width, game.height, 'background');

        this.currentText = game.add.text(
            game.world.centerX,
            game.world.centerY,
            this.instructions[this.textCounter],
            this.textConfig
        );

        this.currentText.anchor.set(0.5);
        this.game.add.tween(this.game.world).to( { alpha: 1 }, 500, "Linear", true );
    },

    update: function() {
        if (this.enterKey.justDown) {
            if (this.textCounter < this.instructions.length - 1) {
                this.textCounter += 1;
                this.currentText.text = this.instructions[this.textCounter];
            } else {
                this.fadeExit = this.game.add.tween(this.game.world).to( { alpha: 0 }, 500, "Linear", true );
                this.fadeExit.onComplete.add(function(){
                    this.game.state.start("Menu");
                }, this);
            }
        }
    }
};
