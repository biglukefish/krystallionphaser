
var gameWidth = 768;
var gameHeight = 512;
var worldWidth = 1000; // these are arbitrary and 
var worldHeight = 1000; // will be reset for each level

// Initialize game
var game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS, 'gameDiv');

// Load states
game.state.add('boot', bootState);
game.state.add('lives', livesState);
game.state.add('menu', menuState);
game.state.add('load', loadState);
game.state.add('play', playState);
game.state.add('die', dieState);
game.state.add('gameOver', gameOverState);


// Start first state
game.state.start('boot', true, true);