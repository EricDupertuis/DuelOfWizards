var game = new Phaser.Game(800, 600, Phaser.AUTO, 'ggj16');

game.state.add("Menu", menuState);
game.state.add("Game", gameState);
game.state.add("End", endState);

//@TODO don't forget to switch back to menu
game.state.start('Menu');
