var STATE_INIT = "init";
var STATE_PICK = "pick";
var STATE_ORDER = "order";
var STATE_COMBAT = "combat";
var STATE_WON = "won";
var STATE_ANIMATION_HOLD = "animation";
var DARKEN_ALPHA = 0.6;

var FACTIONS = ["Mayans", "Satan"];

var MAX_POWER_LEVEL = 6;

// Effect is a function taking player and opponent card as parameters
createCard = function (name, faction, effect, imageName) {
    res = {
        "name": name,
        "faction": faction,
        "effect": effect,
        "imageName": imageName,
    };

    res.effect = _.bind(effect, res);

    return res;
};

var powerLevelCardEffect = function (player, opponentCard) {
    if (player.faction == this.faction) {
        player.score.powerLevel += 3;
    } else {
        player.score.powerLevel += 1;
    }

    if (player.score.powerLevel > MAX_POWER_LEVEL) {
        player.score.powerLevel = MAX_POWER_LEVEL;
    }
};

var attackEffect = function (player, opponentCard) {
    console.log(this.name, DEFENSE_CARDS.indexOf(opponentCard));
    if (DEFENSE_CARDS.indexOf(opponentCard) != -1) {
        return;
    }

    if (player.faction == this.faction) {
        player.otherPlayer.score.powerLevel -= 3;
    } else {
        player.otherPlayer.score.powerLevel -= 2;
    }

    if (player.otherPlayer.score.powerLevel < 0) {
        player.otherPlayer.score.powerLevel = 0;
    }
};

var defenseEffect = function (player, opponentCard) {
    if (ATTACK_CARDS.indexOf(opponentCard) == -1) {
        return;
    }
    if (player.faction == this.faction) {
        player.score.powerLevel += 3;
    } else {
        player.score.powerLevel += 2;
    }

    if (player.score.powerLevel > MAX_POWER_LEVEL) {
        player.score.powerLevel = MAX_POWER_LEVEL;
    }
};

var artifactEffect = function (player, opponentCard) {
    if (ANTIARTIFACT_CARDS.indexOf(opponentCard) != -1) {
        return;
    }
    if (player.faction == this.faction) {
        player.score.hasArtifact = true;
    }
};

var antiArtifactEffect = function (player, opponentCard) {
    player.otherPlayer.score.hasArtifact = false;
};

var jockerEffect = function (player, opponentCard, imageGroup) {
    newcard = _.sample(DECK, 1)[0];
    console.log("Joker: " + newcard.name);
    newcard.effect(player, opponentCard, imageGroup);

    var img, x, y;

    if (player.faction == FACTIONS[0]) {
        x = 2 * game.world.width / 10;
    } else {
        x = 8 * game.world.width / 10;
    }
    y = game.world.height / 2;

    console.log(this);
    img = imageGroup.create(x, y, newcard.imageName);

    img.anchor.setTo(0.3, 0.3);
    img.scale.setTo(0.2, 0.2);
};


DEFENSE_CARDS = [
    createCard("Team0 defense", FACTIONS[0], defenseEffect, 'cards/defense/Mayans.png'),
    createCard("Team1 defense", FACTIONS[1], defenseEffect, 'cards/defense/Satan.png'),
    createCard("neutral defense", "", defenseEffect, 'cards/defense/Neutral.png'),
    createCard("neutral defense", "", defenseEffect, 'cards/defense/Neutral.png'),
    createCard("neutral defense", "", defenseEffect, 'cards/defense/Neutral.png')
];

ATTACK_CARDS = [
    createCard("Team0 attack", FACTIONS[0], attackEffect, 'cards/attacks/Mayans.png'),
    createCard("Team1 attack", FACTIONS[1], attackEffect, 'cards/attacks/Satan.png'),
    createCard("neutral attack", "", attackEffect, 'cards/attacks/Neutral.png'),
    createCard("neutral attack", "", attackEffect, 'cards/attacks/Neutral.png'),
    createCard("neutral attack", "", attackEffect, 'cards/attacks/Neutral.png')
];

ANTIARTIFACT_CARDS = [
    createCard("antiartifact", "", antiArtifactEffect, 'cards/antiartifact.png')
];

DECK = _.union(ANTIARTIFACT_CARDS, ATTACK_CARDS, DEFENSE_CARDS, [
    createCard("Team0 up", FACTIONS[0], powerLevelCardEffect, 'cards/power_ups/' + FACTIONS[0] + '.png'),
    createCard("Team1 up", FACTIONS[1], powerLevelCardEffect, 'cards/power_ups/' + FACTIONS[1] + '.png'),
    createCard("neutral up", "", powerLevelCardEffect, 'cards/power_ups/Neutral.png'),
    createCard("neutral up", "", powerLevelCardEffect, 'cards/power_ups/Neutral.png'),
    createCard("neutral up", "", powerLevelCardEffect, 'cards/power_ups/Neutral.png'),
    createCard("neutral up", "", powerLevelCardEffect, 'cards/power_ups/Neutral.png'),
    createCard("neutral up", "", powerLevelCardEffect, 'cards/power_ups/Neutral.png'),
    createCard("neutral up", "", powerLevelCardEffect, 'cards/power_ups/Neutral.png'),
    createCard("Team0 artifact", FACTIONS[0], artifactEffect, 'cards/artifacts/Mayans.png'),
    createCard("Team0 artifact", FACTIONS[0], artifactEffect, 'cards/artifacts/Mayans.png'),
    createCard("Team1 artifact", FACTIONS[1], artifactEffect, 'cards/artifacts/Satan.png'),
    createCard("Team1 artifact", FACTIONS[1], artifactEffect, 'cards/artifacts/Satan.png'),
    createCard("Joker", "", jockerEffect, 'cards/joker.png'),
    createCard("Joker", "", jockerEffect, 'cards/joker.png'),
    createCard("Joker", "", jockerEffect, 'cards/joker.png')
]);


var gameScore = function () {
    this.powerLevel = 2;
    this.hasArtifact = false;
};

var gameState = function () {
    this.config = null;
    this.players = [];
    this.players[0] = [];
    this.players[1] = [];
    this.currentPlayer = null;
    this.cursors = null;
    this.enterKey = null;
    this.fadeIn = null;
    this.fadeExit = null;

    this.players[0].otherPlayer = this.players[1];
    this.players[1].otherPlayer = this.players[0];

    this.players.forEach(function (player) {
        player.keys = [];
        player.score = new gameScore();
        player.handImageGroup = null;
        player.hand = [];
        player.combatOrderedHand = [];
    });

    this.booster = null;

    this.deck = DECK;
    this.currentSelectedCard = 0;

    this.gameMusic = null;
};


gameState.prototype = {
    init: function () {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.players[0].chosenAttack = null;
        this.players[1].chosenAttack = null;

        this.currentPlayer = this.players[0];

        this.gameState = STATE_INIT;

        this.players[0].faction = FACTIONS[0];
        this.players[1].faction = FACTIONS[1];

        this.zoomOnSelectedCard = false;
        this.zoomedInCard = null;
        this.toogleZoomKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);

        // Reinitalize scores if we came from a winning screen
        this.players.forEach(function (player) {
            player.score = new gameScore();
            player.hand = [];
            player.combatOrderedHand = [];
        });

    },

    preload: function () {
        // base assets path
        game.load.baseURL = 'assets/';
        this.boosterImageGroup = null;
        this.load.spritesheet('explosion1', 'animationTest.png', 128, 128);

        this.deck.forEach(function(e){
            game.load.image(e.imageName, e.imageName);
        }, this);

        game.load.image('cards/back.png', 'cards/back.png')
        game.load.image('background', 'background.png')


        this.players.forEach(function(player) {
            name = 'pentagrams/' + player.faction;
            game.load.image(name, name + '.png');
            character = 'characters/' + player.faction;
            game.load.image(character, character + '.png');
        }, this);

        game.load.audio('gameMusic', 'music/night_runner.ogg');
    },

    create: function () {
        // Background, must be first
        this.background = game.add.tileSprite(0, 0, game.width, game.height, 'background');
        this.players[0].healthbar = new HealthBar(this.game, {
            x: 2 * game.world.width / 12,
            y: 40,
            animationDuration: 0.01,
            width: game.world.width / 3,
            height: 20,
            bar: {color: "#ecf0f1"},
            bg: {color: "#34495e"}
        });
        this.players[1].healthbar = new HealthBar(this.game, {
            x: 10 * game.world.width / 12,
            y: 40,
            animationDuration: 0.01,
            width: game.world.width / 3,
            height: 20,
            bar: {color: "#ecf0f1"},
            bg: {color: "#34495e"},
            flipped: true
        });

        this.players.forEach(function(player) {
            player.artifactSprite = game.add.image(game.world.width / 2 - 100, 50,
                                                            'pentagrams/' + player.faction);

            player.artifactSprite.scale.setTo(0.1, 0.1);
            player.artifactSprite.anchor.setTo(0.5, 0.5);

            player.characterSprite = game.add.image(0, game.world.height, 'characters/' + player.faction);
            player.characterSprite.anchor.setTo(0, 1);
        });

        this.players[0].artifactSprite.x = game.world.width / 2 - 80;
        this.players[1].artifactSprite.x = game.world.width / 2 + 80;

        this.players[1].characterSprite.x = game.world.width;
        this.players[1].characterSprite.anchor.setTo(1, 1);

        this.fadeIn = this.game.add.tween(this.game.world).to( { alpha: 1 }, 500, "Linear", true );

        this.resolvingCardPicturesGroup = game.add.group();


        this.gameMusic = game.add.audio('gameMusic');
        this.gameMusic.loop = true;
        this.gameMusic.play();
        console.log('Play game music');
    },

    debugState: function () {
        prettyCards = function (p) {
            return _.map(p, function (c) {
                return c.name
            }).join();
        };

        console.log("State: " + this.gameState);
        if (this.currentPlayer == this.players[0]) {
            console.log("Player 0 plays");
        } else {
            console.log("Player 1 plays");
        }
        console.log("Deck: " + prettyCards(this.deck));
        console.log("Booster: " + prettyCards(this.booster));
        console.log("Player 0's hand: " + prettyCards(this.players[0].hand));
        console.log("Player 1's hand: " + prettyCards(this.players[1].hand));

        console.log("Player 0's combat set: " + prettyCards(this.players[0].combatOrderedHand));
        console.log("Player 1's combat set: " + prettyCards(this.players[1].combatOrderedHand));

        console.log("Player 1 score: " + this.players[0].score.powerLevel + ' ' + this.players[0].score.hasArtifact);
        console.log("Player 2 score: " + this.players[1].score.powerLevel + ' ' + this.players[1].score.hasArtifact);
    },


    clearAllKeypresses: function () {
        this.players.forEach(function (player) {
            player.keys.forEach(function (entry, i) {
                entry.justDown;
            }, this);
        }, this);
    },

    handleInitPhase: function () {
        this.players.forEach(function (player) {
            player.hand = [];
            player.combatOrderedHand = [];
        });
        this.booster = this.createBooster(this.deck);
        this.gameState = STATE_PICK;
        this.debugState();

        this.resolvingCardPicturesGroup.destroy();
        this.resolvingCardPicturesGroup = game.add.group();
    },

    handlePickPhase: function () {
        if (this.cursors.up.justDown) {
            if (this.currentSelectedCard > 0) {
                this.currentSelectedCard -= 1;
            }
        } else if (this.cursors.down.justDown) {
            if (this.currentSelectedCard < this.booster.length - 1) {
                this.currentSelectedCard += 1;
            }
        }

        if (this.booster.length <= 1) {
            this.gameState = STATE_ORDER;
        }

        if (this.enterKey.justDown) {
            if (this.currentSelectedCard < this.booster.length) {
                this.currentPlayer.hand.push(this.booster[this.currentSelectedCard]);
                this.booster.splice(this.currentSelectedCard, 1);
                this.currentPlayer = this.currentPlayer.otherPlayer;
                this.currentSelectedCard = 0;
                this.zoomOnSelectedCard = false;
                this.debugState();
            }
        }
    },

    handleOrderPhase: function () {
        if (this.cursors.left.justDown) {
            this.currentSelectedCard --;
            this.currentSelectedCard = Math.max(this.currentSelectedCard, 0);
        }

        if (this.cursors.right.justDown) {
            this.currentSelectedCard ++;
            this.currentSelectedCard = Math.min(this.currentSelectedCard, this.currentPlayer.hand.length - 1);
        }

        if (this.enterKey.justDown) {
            console.log("current card:" + this.currentSelectedCard);
            this.currentPlayer.combatOrderedHand.push(this.currentPlayer.hand[this.currentSelectedCard]);
            this.currentPlayer.hand.splice(this.currentSelectedCard, 1);
            this.debugState();
            this.zoomOnSelectedCard = false;
            this.currentSelectedCard = 0;
        }


        /* If the hand is empty switch to other player. If both hands are
         * empty, switch to combat phase. */
        if (this.currentPlayer.hand.length == 0) {
            if (this.currentPlayer.otherPlayer.hand.length == 0) {
                this.gameState = STATE_COMBAT;
            } else {
                this.currentPlayer = this.currentPlayer.otherPlayer;
            }
        }
    },

    playAnimation: function(animationName, x, y) {
        this.previousGameState = this.gameState;
        this.gameState = STATE_ANIMATION_HOLD;

        var sprite = game.add.image(game.world.width / 2, game.world.height / 2, 'explosion1');
        sprite.anchor.setTo(0.5, 0.5);
        var anim = sprite.animations.add('explosion1');
        sprite.animations.play('explosion1', 8);

        anim.onComplete.add(function (sprite, animation) {
            this.gameState = this.previousGameState;
            sprite.destroy();
        }, this);
    },

    handleCombatPhase: function () {
        a = this.players[0].combatOrderedHand.splice(0, 1)[0];
        b = this.players[1].combatOrderedHand.splice(0, 1)[0];

        this.resolvingCardPicturesGroup.destroy();
        this.resolvingCardPicturesGroup = game.add.group();


        var img_a = this.resolvingCardPicturesGroup.create(2 * game.world.width / 10, game.world.height / 2, a.imageName);
        var img_b = this.resolvingCardPicturesGroup.create(8 * game.world.width / 10, game.world.height / 2, b.imageName);

        img_a.anchor.setTo(0.5, 0.5);
        img_a.scale.setTo(0.2, 0.2);
        img_b.anchor.setTo(0.5, 0.5);
        img_b.scale.setTo(0.2, 0.2);

        if (a.name == "Joker") {
            img_a.alpha = 0.6;
        }

        if (b.name == "Joker") {
            img_b.alpha = 0.6;
        }

        // Dirty hack to be able to draw card from joker

        a.effect(this.players[0], b, this.resolvingCardPicturesGroup);
        b.effect(this.players[1], a, this.resolvingCardPicturesGroup);


        _.map(this.players, function (player) {
            if (this.checkVictory(player)) {
                console.log(player.faction + " wins");
                this.gameState = STATE_WON;
                this.game.winner = player;
            }
        }, this);

        if (this.players[0].combatOrderedHand.length == 0) {
            if (this.gameState != STATE_WON) {
                this.gameState = STATE_INIT;
            }
        }
        this.playAnimation('explosion1', 200, 200);

        this.debugState();
    },

    drawGame: function() {
        if (this.booster != null) {
            if (this.boosterImageGroup) {
                this.boosterImageGroup.destroy();
            }
        }
        if (this.gameState == STATE_PICK) {
            if (this.booster != null) {
                if (this.boosterImageGroup) {
                    this.boosterImageGroup.destroy();
                }

                this.boosterImageGroup = game.add.group();

                this.booster.forEach(function(card, i){
                    var x = null;
                    var y = null;

                    if (card == this.booster[0]) {
                        x = game.world.width/2 - 50;
                        y = 190;
                    } else if (card == this.booster[1]) {
                        x = game.world.width/2 + 50;
                        y = 190;
                    } else if (card == this.booster[2]) {
                        x = game.world.width/2;
                        y = 300;
                    } else if (card == this.booster[3]) {
                        x = game.world.width/2 - 50;
                        y = 410;
                    } else if (card == this.booster[4]) {
                        x = game.world.width/2 + 50;
                        y = 410;
                    }

                    card.image = this.boosterImageGroup.create(x, y, card.imageName);
                    card.image.anchor.setTo(0.5, 0.5);
                    card.image.scale.setTo(0.1, 0.1);
                    if (i != this.currentSelectedCard) {
                        card.image.alpha = DARKEN_ALPHA;
                    }
                }, this);
            }
        }

        // @TODO Cleaner code to separate left and right player hands
        offsets = [0, 400];
        this.players.forEach(function(player, i) {
            offset = offsets[i];
            if (player.handImageGroup != null) {
                player.handImageGroup.destroy();
            }
            player.handImageGroup = game.add.group();

            player.hand.forEach(function(card, i){
                var x;
                if (player == this.players[0]) {
                    x = (3 * i + 2) * game.world.width/20;
                } else {
                    x = (3 * i + 15) * game.world.width/20;
                }
                var y = 3 * game.world.width / 16;
                var image;

                if (player == this.currentPlayer) {
                    image = player.handImageGroup.create(x, y, card.imageName);
                    if (i != this.currentSelectedCard) {
                        image.alpha = DARKEN_ALPHA;
                    }
                } else {
                    image = player.handImageGroup.create(x, y, 'cards/back.png');
                }
                image.anchor.setTo(0.5, 0.5);
                image.scale.setTo(0.15, 0.15);
            }, this);

            player.combatOrderedHand.forEach(function(card, i){
                var x, y;
                if (player == this.players[0]) {
                    x = game.world.width / 2 - 80;
                } else {
                    x = game.world.width / 2 + 80;
                }
                y = 300 + 120 * i;
                var image = player.handImageGroup.create(x, y, 'cards/back.png');
                image.anchor.setTo(0.5, 0.5);
                image.scale.setTo(0.1, 0.1);
            }, this);

            player.artifactSprite.visible = player.score.hasArtifact;
        }, this);

        this.players.forEach(function (player) {
            player.healthbar.setPercent(100 * player.score.powerLevel / MAX_POWER_LEVEL);
        }, this);

        if (this.gameState == STATE_PICK || this.gameState == STATE_ORDER) {
            this.currentPlayer.characterSprite.alpha = 1.;
            this.currentPlayer.otherPlayer.characterSprite.alpha = 0.5;
        } else {
            this.currentPlayer.characterSprite.alpha = 0.5;
            this.currentPlayer.otherPlayer.characterSprite.alpha = 0.5;
        };


        if (this.gameState == STATE_PICK) {
            this.drawZoomedCard(this.booster[this.currentSelectedCard]);
        } else if (this.gameState == STATE_ORDER) {
            this.drawZoomedCard(this.currentPlayer.hand[this.currentSelectedCard]);
        } else {
            this.zoomOnSelectedCard = false;
        }
    },

    drawZoomedCard: function(card) {
        if (this.zoomedInCardImage != null) {
            this.zoomedInCardImage.destroy();
        }
        this.zoomedInCardImage = game.add.image(game.world.width / 2, game.world.height / 2, card.imageName);
        this.zoomedInCardImage.anchor.setTo(0.5, 0.5);
        this.zoomedInCardImage.scale.setTo(0.5, 0.5);
        this.zoomedInCardImage.visible = this.zoomOnSelectedCard;
},

    update: function () {
        this.drawGame();
        if (this.gameState == STATE_INIT) {
            this.handleInitPhase();
        } else if (this.gameState == STATE_PICK) {
            this.handlePickPhase();
        } else if (this.gameState == STATE_ORDER) {
            this.handleOrderPhase();
        } else if (this.gameState == STATE_COMBAT) {
            this.handleCombatPhase();
        } else if (this.gameState == STATE_WON) {
            this.gameMusic.fadeOut(600);
            this.fadeExit = this.game.add.tween(this.game.world).to( { alpha: 0 }, 1000, "Linear", true );
            this.fadeExit.onComplete.add(function(){
                this.game.state.start("End");
            }, this);
        } else if (this.gameState == STATE_ANIMATION_HOLD) {
            // don't do shit;
        } else {
            console.log("Unknown state: " + this.gameState);
        }

        if (this.toogleZoomKey.justDown) {
            this.zoomOnSelectedCard = !this.zoomOnSelectedCard;
        }

        this.clearAllKeypresses();
    },

    createBooster: function (deck) {
        booster = _.sample(deck, 5);
        return booster;
    },

    // return true if given player wins
    checkVictory: function (player) {
        return player.score.powerLevel >= 6 && player.score.hasArtifact;
    }
};
