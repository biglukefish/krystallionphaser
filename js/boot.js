/**
 * Creates arrays to hold data keys for different badass motherfucking levels.  
 * For example, 'jsonLevelMaps' holds the cache keys to the json 
 * files used in each level.  
 * The index of the array corresponds 
 * to each level (index zero = level 1), and thus an index 
 * key can be passed around to the various state objects.
 */

var version = '?11'  // used to trick browser's cache into loading the file every time.  Appended
// to the file names of assets.  Change this with each new upload to servers.


var jsonLevelMaps = ['jsonMapLevel1', 'jsonMapLevel2', 'jsonMapLevel3', 'jsonMapLevel4', 'jsonMapLevel5'];
var backgrounds = ['landBG', 'jungleBG', 'jungleBG', 'blackSquare', 'blackSquare'];
var music = ['reggae', 'reggae', 'reggae', 'ghostMusic', 'ghostMusic'];


/**
 * State object representing booting of the game.  It starts
 * the physics system and a few other items, then calls the
 * 'load' state object.
 */
var bootState = {


	preload:  function(){

		game.load.image('loadingbar', 'assets/singleSprites/loadingbar.png' + version);
		game.load.image('krystal_single', 'assets/singleSprites/krystal_single.png' + version); // For loading screen and 'lives' screen

	},

    // 'create' is auto-called by phaser
    create: function() {
    	
        game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = '#eee';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.start('load');
    }

    
};