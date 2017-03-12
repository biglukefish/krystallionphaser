/**
 * State object called by boot.  Loads files and then calls  the 
 * motherfucking main menu state object.
 */

var loadState = {
    
    
    preload: function() {
        
        
        this.preloadBar = game.add.sprite(gameWidth / 2, gameHeight / 2, 'loadingbar');
        this.preloadBar.anchor.setTo(0.5, 0.5);
        this.krystalPreload = game.add.sprite(10, 30, 'krystal_single')
        this.load.setPreloadSprite(this.preloadBar);




        // Load Tilemaps
        for (i=1; i < 6; ++i){
            game.load.tilemap('jsonMapLevel' + i, 'levelData/level_' + i + '.json' + version, 
            null, Phaser.Tilemap.TILED_JSON);
        }
      
        
        // Load Images
        game.load.image('ground', 'assets/spriteSheets/spritesheet_ground.png'  + version);
        game.load.image('tiles', 'assets/spriteSheets/spritesheet_tiles.png' + version);
        game.load.image('ice', 'assets/spriteSheets/spritesheet_ice.png' + version);
        game.load.image('jungleBG', 'assets/backgrounds/jungleBG.png' + version);
        game.load.image('graveYardBG', 'assets/backgrounds/graveYardBG.png' + version);
        game.load.image('snowyBG', 'assets/backgrounds/snowyBG.png' + version);
        game.load.image('iceBG', 'assets/backgrounds/iceBG.png' + version);
        game.load.image('landBG', 'assets/backgrounds/landBG.png' + version);
        game.load.image('blocker', 'assets/singleSprites/blocker.png' + version);  // invisible sprite to block patrolling enemies
        game.load.image('balloon', 'assets/singleSprites/balloon.png' + version);
        game.load.image('clock', 'assets/singleSprites/clock.png' + version);
        game.load.image('redSquare', 'assets/backgrounds/redSquare.png' + version)
        game.load.image('blackSquare', 'assets/backgrounds/blackSquare.png' + version)
        game.load.image('mainmenu', 'assets/mainmenu.png' + version);
        game.load.image('exit', 'assets/singleSprites/signExit.png' + version);// image is arbitrary, will be invisible, used to trigger level exit callback
        game.load.image('smallCoin', 'assets/HUD/smallCoin.png' + version); // coin that's part of the display
        game.load.image('gameCoin', 'assets/HUD/coinGold.png' + version);  // actual coins in the game
        game.load.image('A', 'assets/buttons/A_.png' + version);
        game.load.image('B', 'assets/buttons/B_.png' + version);
        game.load.image('raygun', 'assets/singleSprites/raygunPurple.png' + version);
        game.load.image('laser', 'assets/singleSprites/laserPurple.png' + version);
        game.load.image('spikes', 'assets/singleSprites/spikes.png' + version);
        game.load.image('star', 'assets/singleSprites/star.png' + version);

        
        
        
        // Load Atlases
        game.load.atlas('krystalatlas', 'assets/atlases/krystal.png' + version,
            'assets/atlases/krystal.json' + version, 
            Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('kenneyEnemiesAtlas', 'assets/enemies/kenneyEnemies.png' + version,
            'assets/enemies/kenneyEnemies.json' + version, 
            Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('HUD_Atlas', 'assets/HUD/HUD.png' + version,
            'assets/HUD/HUD.json' + version, 
            Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('itemsAtlas', 'assets/atlases/items.png' + version, 
            'assets/atlases/items.json' + version, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('alienAtlas', 'assets/atlases/alien.png' + version, 
            'assets/atlases/alien.json' + version, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('fireball', 'assets/atlases/fireballs.png' + version,
            'assets/atlases/fireballs.json' + version, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('joystick', 'assets/atlases/joystick.png' + version,
            'assets/atlases/joystick.json' + version, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);            
        
        // Load Audio
        game.load.audio('reggae', 'assets/sounds/Retro Reggae.ogg' + version);
        game.load.audio('ghostMusic', 'assets/sounds/Mission Plausible.ogg' + version);
        game.load.audio('die', 'assets/sounds/zapThreeToneDown.ogg' + version);
        game.load.audio('menuTheme', 'assets/sounds/Flowing Rocks.ogg' + version);
        game.load.audio('krystalDieSound', 'assets/sounds/krystalDieSound.ogg' + version);
        game.load.audio('jump', 'assets/sounds/jump1.ogg' + version);
        game.load.audio('enemyStompSound', 'assets/sounds/creature2.ogg' + version);
        game.load.audio('coinCollect', ['assets/sounds/coinCollect.ogg' + version, 
            'assets/sounds/coinCollect.m4a' + version]);
        game.load.audio('powerUp', 'assets/sounds/powerUp8.ogg' + version);
        game.load.audio('laser', 'assets/sounds/laser5.ogg' + version);
        game.load.audio('alienSound', 'assets/sounds/creature1.ogg' + version);
        game.load.audio('mediumExplosion', 'assets/sounds/mediumExplosion.ogg' + version);
        game.load.audio('pickup', 'assets/sounds/pickup5.ogg' + version);
        game.load.audio('fireballSound', 'assets/sounds/fireballSound.ogg' + version);

        // Load fonts
        game.load.bitmapFont('nokia',
            'assets/nokia16black.png' + version,
            'assets/nokia16black.xml' + version);
        
        
        this.load.onLoadComplete.add(this.loadComplete, this);

    },
    
    create: function() {
        
//        game.state.start('menu');
        game.state.start('lives', true, false, 3, 99, 0);
    },

    loadComplete: function(){
        console.log('load complete');
    }
};

