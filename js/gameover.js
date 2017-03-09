/**
 * It's obvious what this does.  It rubs your death in your face.
 */

var gameOverState = {
    
    init: function() {
        this.time = 0;
    },
    
    create: function() {
        
        game.stage.backgroundColor = 'rgb(255, 255, 255)';
        var gameover = game.add.bitmapText(game.camera.width / 2, 
            game.camera.height / 2, 'nokia','game over', 25);
        gameover.anchor.x = 0.5;
        
    },

    update: function(){
        this.time += 1;
        if (this.time === 150){
            this.time = 0;
            game.state.start('boot', true, true);
        }       
        
    },
       
};






