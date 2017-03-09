/**
 * 'Lives' state object.  This screen displays how many lives Krystal has 
 * left, a la Super Mario Bros.  The first time it is called, it passes through 
 * the init values received from the 'menu' state object, passing them into 
 * the 'play' state object.  Whenever Krystal dies or starts a new level,
 * it will receive and pass through the new init values.
 */

var livesState = {
    
    
    init: function(level_index, lives, coins){
        
        this.level_index = level_index
        this.lives = lives;
        this.coins = coins;
        this.time = 0;
        
    },
    
    
    create: function() {
        
        game.stage.backgroundColor = 'rgb(255, 255, 255)';
        this.krystal_single = game.add.sprite((game.camera.width / 2) - 80, 210,
            'krystal_single');
        this.xLives = game.add.bitmapText((game.camera.width) / 2, 230, 'nokia',' x    ' + this.lives, 25);
        this.whichLevel = game.add.bitmapText((game.camera.width) / 2, 300, 'nokia','level ' + (this.level_index + 1), 25);
        this.whichLevel.anchor.setTo(0.5, 0.5);
        this.directions = game.add.bitmapText(game.camera.width / 2, 480, 'nokia',
            'arrows to move, spacebar for special item', 25);
        this.directions.anchor.x = 0.5;
        
    },


    update: function(){
        
        this.time += 1;
        if (this.time === 150){
            this.time = 0;
            game.state.start('play', true, false, this.level_index, 
                this.lives, this.coins);
        }       
        
    },
       
};





