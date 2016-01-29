var game = new Phaser.Game(800, 600, Phaser.AUTO, 'ggj16');

game.state.add("Menu", menuState);
game.state.add("Game", gameState);
game.state.add("End", endState);

game.state.start('Menu');
