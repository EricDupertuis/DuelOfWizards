var endState = function () {

};

endState.prototype = {
    init: function() {
        this.endFadeIn = null;
    },

    preload: function() {
        game.load.baseURL = 'assets/';
        this.load.spritesheet('fatalities/Mayans', 'fatalities/Mayans.png', 600, 600);
        this.load.spritesheet('fatalities/Satan', 'fatalities/Satan.png', 600, 600);
    },

    create: function() {
        var fatalities_name = 'fatalities/' + this.game.winner.faction;
        console.log(fatalities_name);

        this.game.add.tween(this.game.world)
                     .to({ alpha: 1 }, 500, "Linear", true );

        var sprite = game.add.image(game.world.width / 2,
                                    game.world.height / 2,
                                    fatalities_name);
        sprite.anchor.setTo(0.5, 0.5);
        var anim = sprite.animations.add(fatalities_name);
        sprite.animations.play(fatalities_name, 2);;

        anim.onComplete.add(function (sprite, animation) {
            this.fadeExit = this.game.add.tween(this.game.world)
                                          .to( { alpha: 0 }, 500, "Linear", true );
            this.fadeExit.onComplete.add(function(){
                game.state.start("Menu");
            }, this);
            sprite.destroy();
        }, this);

        this.endFadeIn = this.game.add.tween(this.game.world).to( { alpha: 1 }, 500, "Linear", true );
    },

    update: function() {
    }
};
