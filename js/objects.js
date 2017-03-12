
/**
 * Various game objects.  Mostly enemies.
 * 
 */


Bee = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y, 'kenneyEnemiesAtlas');
    game.physics.enable(this);
    this.anchor.setTo(0.5, 0.5);
    this.body.allowGravity = false;
    this.scale.x = 1;
    this.body.setSize(35, 30, 15, 5);
    this.body.immovable = true;
    this.radians = 0;
    this.animations.add('dead_bee', [0, 2]);
    this.animations.add('alive_bee', ['bee', 'bee_fly']);
    this.animations.play('alive_bee', 5, true);
//    this.move = function(){
//        this.body.position.y = 30 * Math.sin(this.radians) + y;
//        this.body.position.x = - 40 * Math.cos(this.radians) + x;
//        this.radians += 0.1;
//    };
};

Bee.prototype = Object.create(Phaser.Sprite.prototype);
Bee.prototype.constructor = Bee;

Bee.prototype.update = function(){
    this.body.position.y = 4 * Math.sin(this.radians) + this.body.position.y;
    this.body.position.x = - 4 * Math.cos(this.radians) + this.body.position.x;
    this.radians += 0.1;
}


Ladybug = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y, 'kenneyEnemiesAtlas');
    game.physics.enable(this);
    this.anchor.setTo(0.5, 0.5);
    this.scale.x = 1;
    this.body.setSize(30, 30, 15, 5);
    this.body.immovable = true;
    this.animations.add('dead_lady', ['ladyBug_hit', 'ladyBug', 'ladyBug_hit', 'ladyBug']);
    this.animations.add('alive_lady', ['ladyBug', 'ladyBug_walk']);
    this.animations.play('alive_lady', 5, true);
    this.dx = -1;
};

Ladybug.prototype = Object.create(Phaser.Sprite.prototype);
Ladybug.prototype.constructor = Ladybug;
Ladybug.prototype.update = function(){
    this.body.position.x += this.dx;
    
}
Ladybug.prototype.deathMarch = function(){
    this.body.enable = false;
    this.dx = 0;
    game.sound.play('enemyStompSound', 8, false);
    this.animations.play('dead_lady', 10, false, true);
}



Piranha = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y + 10, 'kenneyEnemiesAtlas');
    game.physics.enable(this);
    this.jumpCounter = 0;
    this.body.immovable = true;
    this.body.allowGravity = true;
    this.anchor.setTo(0.5, 0.5);
    this.initialY = (y + 10); 
    this.scale.x = -1;
    this.body.setSize(25, 40, 10, 5);
    this.body.immovable = true;
    this.animations.add('up_piranha', ['piranha']);
    this.animations.add('down_piranha', ['piranha_down']);
    this.animations.play('up_piranha', 7, true);
};

Piranha.prototype = Object.create(Phaser.Sprite.prototype);
Piranha.prototype.constructor = Piranha;
Piranha.prototype.update = function(){
    this.jumpCounter += 1
    if(this.jumpCounter === 150){
        this.alpha = 1;
        this.body.velocity.y = -1200;
        this.jumpCounter = 0;
    };
    if(this.body.velocity.y > 0){
        this.animations.play('down_piranha', 7, true);
    } else{
        this.animations.play('up_piranha', 7, true);
    }
    
    if(this.body.position.y > this.initialY){
      
        this.body.position.y = this.initialY;
    }
};


Frog = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y, 'kenneyEnemiesAtlas');
    game.physics.enable(this);
    this.counter = 25;
    this.anchor.setTo(0.5, 0.5);
    this.scale.x = 1;
    this.body.setSize(30, 30, 10, 10);
    this.body.immovable = true;
    this.dx = -150;
    this.animations.add('dead_frog', ['frog_hit', 'frog_dead', 'frog_hit', 'frog_dead']);
    this.animations.add('idle_frog', ['frog']);
    this.animations.add('leap_frog', ['frog_leap']);
    this.animations.play('idle_frog', 5, true);
};

Frog.prototype = Object.create(Phaser.Sprite.prototype);
Frog.prototype.constructor = Frog;
Frog.prototype.update = function(){
    if (this.alive === true){
        if (this.body.blocked.down === true){
            this.animations.play('idle_frog', 5, true);
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        }
    
        this.counter += 1;
        if (this.counter === 150){
            this.animations.play('leap_frog', 5, false);
            this.body.velocity.x = this.dx;
            this.body.velocity.y = -800;
            this.counter = 0;
        }

        if (this.body.blocked.left || this.body.blocked.right){
            this.dx *= -1;
            this.scale.x *= -1;
        }
    }
    
    
Frog.prototype.deathMarch = function(){
    this.body.enable = false;
    this.dx = 0;
    game.sound.play('enemyStompSound', 8, false);
    this.animations.play('dead_frog', 10, false, true);
}
    
    
};


Bat = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y, 'kenneyEnemiesAtlas');
    game.physics.enable(this);
    this.anchor.setTo(0.5, 0.5);
    this.scale.x = 1;
    this.body.allowGravity = false;
    this.body.immovable = true;
    this.body.setSize(60, 10, 10, 10);
    this.animations.add('dead_bat', [31, 33]);
    this.animations.add('alive_bat', ['bat', 'bat_fly']);
    this.animations.play('alive_bat', 7, true);
    this.dx = -3;
};

Bat.prototype = Object.create(Phaser.Sprite.prototype);
Bat.prototype.constructor = Bat;
Bat.prototype.update = function(){
    this.body.position.x += this.dx;
};


Ghost = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y, 'kenneyEnemiesAtlas');
    game.physics.enable(this);
    this.body.allowGravity = false;
    this.anchor.setTo(0.5, 0.5);
    this.scale.x = 1;
    this.body.setSize(45, 50, 3, 15);
    this.body.immovable = true;
    this.animations.add('dead_ghost', ['ghost_dead']);
    this.animations.add('idle_ghost', ['ghost_normal']);
    this.animations.add('attack_ghost', ['ghost']);
    this.animations.play('idle_ghost', 1, true);
    this.dx = 0;
};

Ghost.prototype = Object.create(Phaser.Sprite.prototype);
Ghost.prototype.constructor = Ghost;
Ghost.prototype.update = function(){
    this.body.position.x += this.dx;
    
}
Ghost.prototype.attack = function(krystal){
    if (((krystal.position.x < this.position.x) && (krystal.scale.x === -1)) ||
            ((krystal.position.x > this.position.x) && (krystal.scale.x === 1))){
        this.animations.play('attack_ghost', 1, true);
        game.physics.arcade.accelerateToObject(this, krystal, 250)
    } else {
        this.animations.play('idle_ghost', 1, true);
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }
    
}



Alien = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y, 'alienAtlas');
    game.physics.enable(this);
    this.body.allowGravity = true;
    this.anchor.setTo(0.5, 0.5);
    this.originalX = x;
    this.scale.x = -1;
    this.body.setSize(45, 100, 25, 92);
    this.body.immovable = true;
    this.health = 8;
    this.isHit = false;
    this.animations.add('alien_walk', ['alien_walk1', 'alien_walk2']);
    this.animations.add('alien_jump', ['alien_jump']);
    this.animations.add('alien_hit', ['alien_hit', 'alien_hit_flash','alien_hit', 'alien_hit_flash','alien_hit', 'alien_hit_flash','alien_hit', 'alien_hit_flash'])
    this.animations.play('alien_walk', 8, true);
    this.dx = - 4;
    this.counter = 0;

    this.raygun = game.add.sprite(10, 20, 'raygun');
    this.addChild(this.raygun); 
    this.alienweapon = game.add.weapon(1, 'laser');
    this.alienweapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.alienweapon.bulletSpeed = 600;
    this.alienweapon.trackSprite(this.raygun, -70, 32, false);
    this.alienweapon.autofire = true;
    this.alienweapon.bulletGravity.y = -2000;
    this.alienweapon.fireRate = 2000;
    this.alienweapon.fireAngle = Phaser.ANGLE_LEFT;
    this.alienweapon.setBulletBodyOffset(30, 10, 18, 30);
};

Alien.prototype = Object.create(Phaser.Sprite.prototype);
Alien.prototype.constructor = Alien;
Alien.prototype.getHit = function(){
    this.isHit = true;
    this.health -= 1;
    game.time.events.add(300, this.notHit, this);
}

Alien.prototype.notHit = function(){
    this.isHit = false;
}


Alien.prototype.update = function(){

    this.counter += 1;


    if (this.alive === true){

        if (this.body.blocked.down && !this.isHit){
        this.animations.play('alien_walk', 8, true);
        }
    
        // move back and forth
        this.body.position.x += this.dx;
        if ((this.originalX - this.body.position.x) > 200){
            this.dx *= -1;
        }
        if ((this.originalX - this.body.position.x) < -10){
            this.dx *= -1;
        }
    
        // jump every so often
        if (this.counter === 150){
            this.body.velocity.y = -800
            this.animations.play('alien_jump', 1, false);
            this.counter = 0;
        } 

        if (this.isHit === true){
            this.animations.play('alien_hit', 10, false);
        }

        if (this.health <= 0){
            this.destroy(true);
            this.alienweapon.destroy();
        }

    } else{ // if Alien hits Krystal, freeze him on the screen

            this.dx = 0;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        }
    
    
        

    }
    
    
   

