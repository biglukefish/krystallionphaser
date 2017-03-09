var dieState = {
    
    init: function(level_index, lives, krystal){
        this.level_index = level_index
        this.lives = lives;
        this.time = 0;
        this.krystal = krystal
    },
    
    create: function() {
        game.stage.backgroundColor = 'rgb(255, 255, 255)';
        
    },

    update: function(){
        krystal.animations.play('die', 10, false, true);
        this.time += 1;
        if (this.time === 150){
            this.time = 0;
            game.state.start('lives', true, false, this.level_index, this.lives);
        }       
        
    },
       
};
