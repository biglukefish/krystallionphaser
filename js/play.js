/**
 * This 'play' state object is where the main game logic resides.  The 
 * specific level is constructed using the arguments passed into the init 
 * function, which has an index used for referencing various global arrays
 * of game data.  This is where the magic happens.  And by magic, I mean some 
 * coding that I did.
 */

var playState = {
    
    init: function(level_index, lives, coins){
        
        this.level_index = level_index
        this.leveldata = gameData[level_index];
//        this.enemyDataForThisLevel = enemyDataForLevel[level_index];
        this.lives = lives;
        this.coins = coins;
        this.coinsNeededForExtraLife = 99
        game.time.reset();
        this.enemyStack = [];
        this.gravity = 2000
    },
    
    create: function() {
        
        // Basic level setup
        game.world.setBounds(0, 0, this.leveldata.map_width, 
            this.leveldata.map_height);
        this.background = game.add.tileSprite(0, 0, this.leveldata.map_width, 
            this.leveldata.map_height, backgrounds[this.level_index]);
        game.sound.play(music[this.level_index], 8, true);
        game.physics.arcade.gravity.y = this.gravity;
        
        
        // Create terrain layer
        this.map = game.add.tilemap(jsonLevelMaps[this.level_index]);
        this.map.addTilesetImage('ground');
        this.map.addTilesetImage('tiles');
        this.map.addTilesetImage('ice');
        this.layer = this.map.createLayer('collidableTerrain');
        this.map.setCollisionByExclusion([0], true, 'collidableTerrain');
        
        
        // Create non-collidable objects behind Krystal 
        this.layer2 = this.map.createLayer('nonCollidableBehind');
            
        
        // Create Krystal
        this.krystal = game.add.sprite(this.leveldata.krystal_loc[0][0],  
            this.leveldata.krystal_loc[0][1], 'krystalatlas');
        this.krystal.anchor.setTo(0.5, 0.5);
        this.krystal.animations.add('dizzy', [0, 1]);
        this.krystal.animations.add('balloon', [2, 7]);
        this.krystal.animations.add('fall', [8, 9]);
        this.krystal.animations.add('jump', [10, 11]);
        this.krystal.animations.add('run', [12, 13, 14, 15]);
        this.krystal.animations.add('slideA', [16, 17]);
        this.krystal.animations.add('die', [18, 19, 20, 21, 22, 23, 18, 
            19, 20, 21, 22, 23]);
        this.krystal.animations.add('slideB', [24, 25]);
        this.krystal.animations.add('stand', [26, 27, 28, 29, 30, 31]);
        this.krystal.animations.play('fall', 10, true);
        this.krystal.events.onKilled.add(this.reload, this)
        this.krystal.checkWorldBounds = true;
        this.krystal.hasBalloon = false;
        this.krystal.hasKey = false;
        game.physics.enable(this.krystal);
        this.krystal.body.immovable = true;
        game.camera.follow(this.krystal);

        // Setup Krystal's fireballs
        this.krystal.hasFireballs = false;
        this.krystal.throwingFireball = false;
        this.fireballs = game.add.weapon(2, 'fireball');
        this.fireballs.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.fireballs.bulletSpeed = 700;
        this.fireballs.trackSprite(this.krystal, 0, 0, false);
        this.fireballs.bulletGravity.y = -800;
        this.fireballs.fireRate = 200;
        this.fireballs.addBulletAnimation('spin', ['fireball', 'fireball90', 
            'fireball180', 'fireball270'], 10, true)
        this.fireballs.fireAngle = 320;
        this.fireballs.setBulletBodyOffset(30, 30, 18, 18);

                
        
        // Create groups
        this.beesGroup = game.add.group();
        this.blockersGroup = game.add.group();
        this.ladybugGroup = game.add.group();
        this.piranhaGroup = game.add.group();
        this.batGroup = game.add.group();
        this.frogGroup = game.add.group();
        this.coinGroup = game.add.group();
        this.coinBoxGroup = game.add.group();
        this.balloonGroup = game.add.group();
        this.ghostGroup = game.add.group();
        this.fireballGroup = game.add.group();
        

        // Spawn fireball item
        var newfireball;
        for (i=0; i < this.leveldata.fireball_loc.length; ++i){
            newfireball = game.add.sprite(this.leveldata.fireball_loc[0][0],  
                this.leveldata.fireball_loc[0][1], 'fireball');
            game.physics.enable(newfireball);
            newfireball.body.immovable = true;
            newfireball.body.allowGravity = false;
            newfireball.body.setSize(30, 30, 18, 18)
            this.fireballGroup.add(newfireball);
        };
        
        
        // Spawn balloon item
        this.balloon_locs = this.leveldata.balloon_locs;
        var newballoon;
        for (i=0; i < this.balloon_locs.length; ++i){
            newballoon = game.add.sprite(this.balloon_locs[i][0], this.balloon_locs[i][1], 'balloon');
            game.physics.enable(newballoon);
            newballoon.body.setSize(30, 30, 10, 10);
            newballoon.body.allowGravity = false;
            game.add.existing(newballoon);
            this.balloonGroup.add(newballoon);
        };
        
        
        // Spawn coins
        this.coin_locs = this.leveldata.coin_locs;
        var newcoin;
        for (i=0; i < this.coin_locs.length; ++i){
            newcoin = game.add.sprite(this.coin_locs[i][0], 
                this.coin_locs[i][1], 'gameCoin');
            game.physics.enable(newcoin);
            newcoin.body.setSize(30, 30, 12, 12);
            newcoin.body.allowGravity = false;
            newcoin.body.immovable = true;
            game.add.existing(newcoin);
            this.coinGroup.add(newcoin);
        };
        
        
        // Spawn key
        if (this.leveldata.key_loc.length > 0){
            this.key = game.add.sprite(this.leveldata.key_loc[0][0],
                this.leveldata.key_loc[0][1], 'itemsAtlas', 'keyBlue');
        }
        game.physics.enable(this.key);
        this.key.body.setSize(40, 20, 12, 22);
        this.key.body.allowGravity = false;
        this.key.body.immovable = true;
        game.add.existing(this.key);
        
        
        
        // Spawn bees
        this.bee_locs = this.leveldata.bee_locs;
        var newbee;
        for (i=0; i < this.bee_locs.length; ++i){
            newbee = new Bee(game, this.bee_locs[i][0], this.bee_locs[i][1]);
            game.add.existing(newbee);
            this.beesGroup.add(newbee);
            this.enemyStack.push(newbee);
        };
        
        
        
        // Spawn ghosts
        this.ghost_locs = this.leveldata.ghost_locs;
        var newghost;
        for (i=0; i < this.ghost_locs.length; ++i){
            newghost = new Ghost(game, this.ghost_locs[i][0], this.ghost_locs[i][1]);
            game.add.existing(newghost);
            this.ghostGroup.add(newghost);
        };
        
        
        
        // Spawn ladybugs
        this.ladybug_locs = this.leveldata.ladybug_locs;
        var new_ladybug;
        for (i=0; i < this.ladybug_locs.length; ++i){
            new_ladybug = new Ladybug(game, this.ladybug_locs[i][0], this.ladybug_locs[i][1]);
            game.add.existing(new_ladybug);
            this.ladybugGroup.add(new_ladybug);
            this.enemyStack.push(new_ladybug)
        };
        
        
        // Spawn blockers to keep patrolling enemies from falling off ledges
        this.blocker_locs = this.leveldata.blocker_locs;      
        var new_blocker;
        for (i=0; i < this.blocker_locs.length; ++i){
            blocker = game.add.sprite(this.blocker_locs[i][0], 
                this.blocker_locs[i][1], 'blocker')
            this.blockersGroup.add(blocker);
            game.physics.enable(blocker);
            blocker.body.setSize(80, 80, -5, 0);
            blocker.body.allowGravity = false;
            blocker.alpha = 0;
        };
        
        
        // Spawn piranhas
        this.piranha_locs = this.leveldata.piranha_locs;
        var new_piranha;
        for (i=0; i < this.piranha_locs.length; ++i){
            new_piranha = new Piranha(game, this.piranha_locs[i][0], this.piranha_locs[i][1]);
            game.add.existing(new_piranha);
            this.piranhaGroup.add(new_piranha);
            this.enemyStack.push(new_piranha);
        };
        
        
        // Spawn bats
        this.bat_locs = this.leveldata.bat_locs;
        var new_bat;
        for (i=0; i < this.bat_locs.length; ++i){
            new_bat = new Bat(game, this.bat_locs[i][0], this.bat_locs[i][1]);
            game.add.existing(new_bat);
            this.batGroup.add(new_bat);
            this.enemyStack.push(new_bat);
        };
        
        
        // Spawn frogs
        this.frog_locs = this.leveldata.frog_locs;
        var new_frog;
        for (i=0; i < this.frog_locs.length; ++i){
            new_frog = new Frog(game, this.frog_locs[i][0], this.frog_locs[i][1]);
            game.add.existing(new_frog);
            this.frogGroup.add(new_frog);
            this.enemyStack.push(new_frog);
        };
        
        
        // Spawn alien (boss), and attach his raygun
        if (this.leveldata.alien_loc.length > 0){
            this.alien_loc = this.leveldata.alien_loc;
            this.alien = new Alien(game, this.alien_loc[i][0], this.alien_loc[i][1]);
            game.add.existing(this.alien);
            // this.raygun = game.add.sprite(10, 20, 'raygun');
            // this.alien.addChild(this.raygun); 
            // this.alienweapon = game.add.weapon(1, 'laser');
            // this.alienweapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            // this.alienweapon.bulletSpeed = 600;
            // this.alienweapon.trackSprite(this.raygun, -70, 32, false);
            // this.alienweapon.autofire = true;
            // this.alienweapon.bulletGravity.y = -1 * this.gravity;
            // this.alienweapon.fireRate = 2000;
            // this.alienweapon.fireAngle = Phaser.ANGLE_LEFT;
            // this.alienweapon.setBulletBodyOffset(30, 10, 18, 30);

        }
        
        
        
        // Spawn exit
        this.exit = game.add.sprite(this.leveldata.exit[0][0], this.leveldata.exit[0][1], 'exit');
        game.physics.enable(this.exit);
        this.exit.body.immovable = true;
        this.exit.alpha = 0;
        this.exit.body.allowGravity = false;
        

        
        // Create this layer last, so it is rendered over everything else
        this.layer3 = this.map.createLayer('nonCollidableInFront');

        
        /**
         * HUD section.  Creates icons and numbers showing coins collected
         * and time expired, and animates them.  The ones digit turns every 
         * tick, the tens digit every ten ticks, hundreds every hundred ticks.  
         * Thus the Math.pow formula in the frame speed parameter
         */
        this.hudHeight = 25
        
        this.clockStart = [0, 0, 9]
        this.clock = 100;
        this.clockImage = game.add.sprite(game.camera.width - 190, this.hudHeight + 10, 'clock');
        game.physics.enable(this.clockImage);
        this.clockImage.body.allowGravity = false;
        this.clockImage.fixedToCamera = true;
        
        for (i=0; i<3; ++i){
            hudDigit = game.add.sprite(game.camera.width - 100 - (i*30), 
                this.hudHeight, 'HUD_Atlas');
            hudDigit.animations.add('ticks', ['hud9', 'hud8', 'hud7', 'hud6', 
                'hud5', 'hud4', 'hud3', 'hud2', 'hud1', 'hud0']);
            game.physics.enable(hudDigit);
            hudDigit.body.allowGravity = false;
            hudDigit.animations.play('ticks', 1 / Math.pow(10, i), true);
            hudDigit.animations.currentAnim.setFrame(this.clockStart[i], true);
            hudDigit.animations.play('ticks', 1 / Math.pow(10, i), true);
            hudDigit.fixedToCamera = true;
        }
       
        
        
        // Create the coin HUD icon
        this.counterCoin = game.add.sprite(45, this.hudHeight, 'smallCoin');
        this.counterCoin.fixedToCamera = true;
        
        
        // Create numbers that tally the coins
        this.coinOnes = game.add.sprite(115, 
            this.hudHeight, 'HUD_Atlas');
        this.coinOnes.animations.add('tick1s', ['hud0', 'hud1', 'hud2', 'hud3', 
            'hud4', 'hud5', 'hud6', 'hud7', 'hud8', 'hud9']);
        this.coinTens = game.add.sprite(85, 
            this.hudHeight, 'HUD_Atlas');
        this.coinTens.animations.add('tick10s', ['hud0', 'hud1', 'hud2', 'hud3', 
            'hud4', 'hud5', 'hud6', 'hud7', 'hud8', 'hud9']);
        game.physics.enable(this.coinOnes);
        game.physics.enable(this.coinTens);
        this.coinOnes.body.allowGravity = false;
        this.coinTens.body.allowGravity = false;
        this.coinOnes.fixedToCamera = true;
        this.coinTens.fixedToCamera = true;
   
   
        
        /**
         * This section handles user input, both from the keyboard or
         * touchscreen on mobile devices.
         */
        
        // create keyboard
        cursor = game.input.keyboard.createCursorKeys();
        cursor.up.onDown.add(this.jumpHandler, this);
        spacebar = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        spacebar.onDown.add(this.launchFireball, this);

        
        // create boolean triggers for button states to be used on mobile
        // because unlike the spacebar on desktop, buttons only send out
        // one-time signals on each event (i.e. no 'spacebar is pressed' function)
        this.leftIsDown = false;
        this.rightIsDown = false;
        this.jumpIsDown = false;
        this.specialIsDown = false;
        
        
        // create buttons only if the device is iOS
        this.buttonHeight = gameHeight - 102;
        
        if (game.device.iOS === true){
            this.left = game.add.button(10, this.buttonHeight, 'left', this.moveLeft, this);
            this.left.fixedToCamera = true;
            this.left.onInputDown.add(this.leftDown, this);
            this.left.onInputUp.add(this.leftUp, this);
            this.right = game.add.button(110, this.buttonHeight, 'right', this.moveRight, this);
            this.right.fixedToCamera = true;
            this.right.onInputDown.add(this.rightDown, this);
            this.right.onInputUp.add(this.rightUp, this);
            this.jump = game.add.button(700, this.buttonHeight, 'A', this.jumpUp, this);
            this.jump.fixedToCamera = true;
            this.jump.onInputDown.add(this.jumpDown, this);
            this.jump.onInputUp.add(this.jumpUp, this);
            // the 'special' button code handles what happens if the spacebar (desktop)
            // or B button (mobile) is pressed.  It will do different things depending
            // on what item Krystal has (balloon, fireball, etc.)
            this.special = game.add.button(600, this.buttonHeight, 'B', this.keyDown, this);
            this.special.fixedToCamera = true;
            this.special.onInputDown.add(this.specialDown, this)  // Calls function to set boolean to true
            this.special.onInputDown.add(this.launchFireball, this);
            this.special.onInputUp.add(this.specialUp, this)
        }
        
    },


    launchFireball: function(){
        if (this.krystal.hasFireballs === true){
            this.fireballs.fire();
            this.krystal.throwingFireball = true;
            game.time.events.add(150, this.doneLaunchingFireball, this);
        }
    },


    doneLaunchingFireball: function(){
        this.krystal.throwingFireball = false;
    },
    
    
    // These functions handle the button being pressed
    // and unpressed on mobile.  Triggered by onDown and onUp phaser signals.
    leftDown: function(){
        this.leftIsDown = true;
    },
    leftUp: function(){
        this.leftIsDown = false;
    },
    rightDown: function(){
        this.rightIsDown = true;
    },
    rightUp: function(){
        this.rightIsDown = false;
    },
    jumpDown: function(){
        this.jumpIsDown = true;
    },
    jumpUp: function(){
        this.jumpIsDown = false;
    },
    specialDown: function(){
        this.specialIsDown = true;
    },
    specialUp: function(){
        this.specialIsDown = false;
    },
    
    
    moveLeft: function(){
        this.krystal.scale.x = -1;
        this.krystal.body.velocity.x = -250;
        if (this.krystal.body.position.x > game.width / 2
                && this.krystal.deltaX != 0){
            this.background.tilePosition.x -= 0.3;
        }
    },
    
    
    moveRight: function(){
        this.krystal.scale.x = 1;
        this.krystal.body.velocity.x = 250;
        if (this.krystal.body.position.x > game.width / 2
                && this.krystal.deltaX != 0){
            this.background.tilePosition.x += 0.3;
            }
    },
    

    // This handles balloon.  Need this function to be based on boolean value
    // of 'is pressed' since phaser only has onInput signals that dispatch 
    // only once, and balloon needs to fly continuously
    specialPressed: function(){
        if ((spacebar.isDown || this.specialIsDown ) && (this.krystal.hasBalloon === true)){
            this.krystal.animations.play('balloon', 10, true);
            this.krystal.body.velocity.y -= 50;
        }
    },

    update: function(){
        
        
        
        // Update coins.  'this.coinArray' holds the ones value and tens value.  
        // The modulus math is to parse those values.
        this.coinArray = [(this.coins % 10), ((this.coins - (this.coins % 10)) / 10)];
        this.coinOnes.frame = this.coinArray[0]
        this.coinTens.frame = this.coinArray[1]
        
        
        if(game.time.totalElapsedSeconds() > this.clock){
            this.krystalDie(this.krystal, null);
        }


        
        
        // Move Krystal and check for collision
        game.physics.arcade.collide(this.krystal, this.layer);
        game.physics.arcade.collide(this.krystal, this.coinGroup, this.takeCoin);
        game.physics.arcade.collide(this.krystal, this.key, this.takeKey);
        game.physics.arcade.collide(this.krystal, this.balloonGroup, this.getBalloon);
        game.physics.arcade.collide(this.krystal, this.fireballGroup, this.pickupFireball);
        game.physics.arcade.collide(this.krystal, this.coinBoxGroup)
        game.physics.arcade.overlap(this.krystal, this.ladybugGroup, this.stompHandler);
        game.physics.arcade.collide(this.ladybugGroup, this.layer);
        game.physics.arcade.collide(this.frogGroup, this.layer);
        game.physics.arcade.collide(this.krystal, this.beesGroup, this.krystalDie);
        game.physics.arcade.collide(this.krystal, this.piranhaGroup, this.krystalDie);
        game.physics.arcade.collide(this.krystal, this.frogGroup, this.stompHandler);
        game.physics.arcade.collide(this.krystal, this.batGroup, this.krystalDie);
        game.physics.arcade.collide(this.krystal, this.ghostGroup, this.krystalDie);
        game.physics.arcade.collide(this.ladybugGroup, this.blockersGroup, this.turnaround);
        game.physics.arcade.collide(this.frogGroup, this.blockersGroup, this.turnaround);
        game.physics.arcade.overlap(this.krystal, this.exit, this.exitCheck);
        game.physics.arcade.collide(this.alien, this.layer);
        game.physics.arcade.collide(this.krystal, this.alien, this.krystalDie);


        // only check for collision if alien actually exists in level
        if (typeof this.alien !== 'undefined'){
            game.physics.arcade.collide(this.alien, this.fireballs.bullets, this.alienHit); 
            game.physics.arcade.collide(this.krystal, this.alien.alienweapon.bullets, this.krystalDie);   
        }
        
        
        // Avoid updating if Krystal is not alive, as this will result
        // in sounds being played twice.
        if(this.krystal.alive === false){
            return;
        }
        

        // Recalc velocities
        if (cursor.up.isDown || this.jumpIsDown){
            this.executeJump();
        }
        
        if (cursor.left.isDown || this.leftIsDown){
            this.moveLeft();
            
        }
        else if (cursor.right.isDown || this.rightIsDown){
            this.moveRight();
        }
        else{
            this.krystal.body.velocity.x = 0;
        }


        // resize body
        if ((spacebar.isDown || this.specialIsDown) && (this.krystal.hasBalloon === true)){
            this.krystal.body.setSize(35, 80, 30, 25);
        }
        else{
            this.krystal.body.setSize(26, 78, 34, 10);
        }


        // make sure that if krystal is throwing a fireball, it goes in the direction
        // she is facing
        if (this.krystal.scale.x === 1){
            this.fireballs.fireAngle = 330;
        } else {
            this.fireballs.fireAngle = 210;
        }

        
        // Set animation frames
      
        if (this.krystal.body.velocity.y !== 0){
            if (this.krystal.body.velocity.y > 0){
                this.krystal.animations.play('fall', 10, true);
            }
            else if (this.krystal.body.velocity.y < 0){
                this.krystal.animations.play('jump', 10, true);
            }
        }
        if (this.krystal.body.onFloor()){
            if (this.krystal.body.velocity.x !== 0){
                this.krystal.animations.play('run', 10, true);
            }
            else{
                this.krystal.animations.play('stand', 10, true);
            }
        }
        
        if (this.krystal.throwingFireball === true){
            this.krystal.animations.play('slideA', 10, false);
        }
        
        // handles Krystal's special item
        this.specialPressed();
        

        // Make sure y velocity doesn't exceed max velocity
        this.dy_max(this.krystal, this.krystal.body.velocity.y);

        // Keep Krystal in bounds
        if (this.krystal.body.left <= 0){
            this.krystal.body.velocity.x = 0;
        }
        
        if (this.krystal.body.top <= 0){
            this.krystal.body.velocity.y = 0; 
        }  
        
        if (this.krystal.body.right >= this.leveldata.map_width){
            this.krystal.body.velocity.x = 0;
        }     
        
        // Kill Krystal if she goes out of bounds
        if (this.krystal.body.top > game.world.height){
            this.krystalDie(this.krystal, null);
        }
        
        
        // Ghosts attack if krystal has her back turned
        this.ghostGroup.forEach(function(item) {
            item.attack(this.krystal);
        }, this);
        
        
    },


    alienHit:  function(alien, fireball){
        alien.getHit();
        fireball.kill();
    },
    

    pickupFireball: function(krystal, fireball){
        krystal.hasFireballs = true;
        fireball.destroy();
    },

    
    executeJump: function(){
        if (this.krystal.body.onFloor()){ 
                // Jump
                this.krystal.body.velocity.y -= 700;
            }
            else{
                this.krystal.body.velocity.y -= 15;
            }; 
    },
    
    
    takeKey:  function(krystal, obj2){
        krystal.hasKey = true;
        obj2.destroy();
    },
    
    
    powerUp: function(){
        playState.lives += 1;
        playState.coins = 0;
        game.sound.play('powerUp', 10, false);
    },
    
    
    takeCoin: function(obj1, obj2){
        playState.coins += 1;
        obj2.destroy();
        if (playState.coins === playState.coinsNeededForExtraLife){
            playState.powerUp()
        } else{
            game.sound.play('coinCollect', 5, false);
        }  
    },
    
    exitCheck: function(obj1, obj2){
        if (obj1.hasKey === true){
            if (obj1.body.overlapX > (obj1.body.width - 0.01)){
            playState.nextLevel()
            }
        }
    },
    
    getBalloon: function(krystal, balloon){
        krystal.hasBalloon = true;
        balloon.destroy();
    },
    
    stompHandler: function(krystal, obj2){
    // Callback method to handle whether Krystal has stomped on the enemy,
    // or has been hit by the enemy.
        if (obj2.body.touching.up){
            obj2.alive = false;
            obj2.deathMarch();
            krystal.body.velocity.y = -350;
        } else {
            playState.krystalDie(krystal);
        };
    },

    reload: function(){
        game.sound.stopAll();
        playState.lives -= 1;
        if (playState.lives === 0){
            game.state.start('gameOver');
        }else{
            game.state.start('lives', true, false, playState.level_index, playState.lives, playState.coins);
        }
        
    },

    krystalDie: function(krystal, obj2){
        if (krystal.alive === true){
            game.sound.stopAll();            
            krystal.alive = false;           
            krystal.body.allowGravity = false;           
            krystal.body.velocity.x = 0;
            krystal.body.velocity.y = 0;
            this.background = game.add.tileSprite(0, 0, playState.leveldata.map_width, 
            playState.leveldata.map_width, 'redSquare');
            krystal.bringToTop();
            game.stage.backgroundColor = 'rgb(255, 0, 0)';
            krystal.animations.stop();
            krystal.animations.play('die', 10, false, true);
            game.sound.play('lose', 1, false);
            if (!!obj2){
                obj2.alive = false;
                obj2.bringToTop();
                obj2.body.allowGravity = false;
            }          
        } 
    },
    
    
    freezeAll: function(){
        
    },

    dy_max: function(sprite, dy) {
        if (dy < -750) {
            sprite.body.velocity.y = -750;
        }else if (dy > 750){
            sprite.body.velocity.y = 750;
        }
    },
    
    updateCounter: function(){
        this.clock -= 1;
    },
    
    turnaround: function(obj1, obj2){
        obj1.dx = (-1 * obj1.dx);
        obj1.scale.x *= -1;
        if (obj1.dx > 0){
            obj1.body.position.x += 2
        } else {
            obj1.body.position.x -= 2
        }
    },
    
    nextLevel: function(obj1, obj2){
        game.sound.stopAll();
        game.state.start('lives', true, false, playState.level_index + 1, 
            playState.lives, playState.coins);
    },
    
    jumpHandler: function(){
        if (this.krystal.body.onFloor()){ 
                game.sound.play('jump', 3, false);
            }
    },
    
    render: function() {
        
       // this.fireballGroup.forEach(function(item) {
       //     game.debug.body(item);
       // }, this);
       // this.fireballs.bullets.forEach(function(item) {
       //     game.debug.body(item);
       // }, this);
////     
//        
////      
//          game.debug.body(this.alien);
       // game.debug.bodyInfo(this.krystal, 0, 100);
//          
//        game.debug.text('Loop Count: ' + this.clock, 32, 64);
    }
    
    
};



