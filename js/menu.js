/**
 * Main menu state object.  Pressing spacebar will call 
 * the 'lives' state object, passing it the initial values
 * of a new game, so you can play Krystallion again and again and again.
 */


var menuState = {
    
    
    create: function() {
        
        game.world.setBounds(0, 0, worldWidth, worldHeight);
        
        background_menu = game.add.sprite(0, 0, 'mainmenu');
        
        game.sound.play('menuTheme', 8, true);
        
        spacebar = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    },

    update: function(){
        
        // Start game on spacebar down
        if (spacebar.isDown){
            game.sound.stopAll();
            
            // last three params are the level index (0 = level 1), the
            // number of lives krystal starts with, and the 
            // amount of coins she starts with.
            game.state.start('lives', true, false, 0, 3, 0);
            
        }
    }
    
};
