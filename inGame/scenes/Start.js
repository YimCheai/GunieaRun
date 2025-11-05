import Player from '../object/Player.js';
import Ground from '../object/Ground.js';
import Item from '../object/Item.js';
import Cherry from '../object/Cherry.js';

export class Start extends Phaser.Scene {
    

    constructor() {
        super('Start');
        this.font_04B = '"04B"'
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('ground', 'assets/ground2.png');
        this.load.image('cherry', 'assets/cherry.png');
        this.load.image('peach', 'assets/peach.png');
        this.load.image('heartBar0', 'assets/heartBar0.png');
        this.load.image('heartBar1', 'assets/heartBar1.png');
        this.load.image('heartBar2', 'assets/heartBar2.png');
        this.load.image('heartBar3', 'assets/heartBar3.png');
        this.load.image('ball', 'assets/ball.png');
    }

    create() {
        console.log("Start scene created");
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // 배경
        this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background').setOrigin(0, 0);
        
        this.lives = 3;


        // 땅
        this.grounds = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        this.playerPlatforms = this.physics.add.staticGroup();
        this.playerPlatforms.create(0, 877).setOrigin(0, 0).setSize(this.scale.width * 2, 10).setVisible(false);


        let groundX = 217;
        for (let i = 0; i < 100; i++) {
            const ground = new Ground(this, groundX, 877);
            this.grounds.add(ground);
            groundX += 433;
        }

        // 플레이어
        this.player = new Player(this, 34, 600);

        // 아이템
        this.cherry = new Cherry(this, 371, 677);
        this.cherry.setDisplaySize(120, 120);
        this.peach = new Item(this, 800, 677, 'peach');
        this.peach.setDisplaySize(124, 114);


        // UI
        
        document.fonts.load('400 40px "04B"');

        this.peachPointTXT = this.add.text(1696, 111, `${this.player.peach_point} x `, {
            fontFamily: this.font_04B,
            fontSize: 40,
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 8
        });
        
        this.peachTXT = this.add.text(1696, 39,"PEACH", {
            fontFamily: this.font_04B,
            fontSize: 40,
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 8
        });


        
        this.cherryPointTXT = this.add.text(887, 968, ` x ${this.player.cherry_point}`, {
            fontFamily: this.font_04B,
            fontSize: 40,
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 8
        });

        this.cherryImage = this.add.image(773, 935, 'cherry')
            .setOrigin(0, 0);

        this.lifeTXT = this.add.text(41, 39, "LIFE", {
            fontFamily: this.font_04B,
            fontSize: 40,
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 8
        });
        
        this.heartBarImage = this.add.image(41, 85, 'heartBar3')
            .setOrigin(0, 0);

        // 장애물
        this.ball = this.physics.add.sprite(1000, 837, 'ball');
        this.ball.setDisplaySize(80, 80);
        this.ball.setImmovable(true);
        this.ball.body.setAllowGravity(false);

        this.scoreTXT = this.add.text(1697, 915, `SCORE`, {
            fontFamily: this.font_04B,
            fontSize: 40,
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 8
        });

        this.scorePointTXT = this.add.text(1627, 965, `${String(this.player.point).padStart(6, '0')}`, {
            fontFamily: this.font_04B,
            fontSize: 50,
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 8
        });

        // 충돌 설정
        this.physics.add.collider(this.player, this.playerPlatforms);

        this.physics.add.collider(this.player, this.ball, this.handleBallCollision, null, this);

        //cherry overlap
        this.physics.add.overlap(this.player, this.cherry, ()=> {
            this.cherry.destroy();
            this.player.cherry_point += 1;
            this.player.point += 20;
            this.cherryPointTXT.setText(` x ${this.player.cherry_point}`);
            this.scorePointTXT.setText(`${String(this.player.point).padStart(6, '0')}`);
        });

        //peach overlap
        this.physics.add.overlap(this.player, this.peach, ()=> {
            this.peach.destroy();
            this.player.peach_point += 1;
            this.player.point += 10;
            this.peachPointTXT.setText(`${this.player.peach_point} x `);
            this.scorePointTXT.setText(`${String(this.player.point).padStart(6, '0')}`);
        });
    }

    update() {
        this.background.tilePositionX += 5.0;

        this.player.jump(this.spaceKey);

        // 땅 움직이기 (스크롤)
        this.grounds.children.iterate(ground => {
            ground.x -= 5.0;
            ground.body.updateFromGameObject();
        });
        
        this.cherry.x -= 5.0;
        this.peach.x -= 5.0;
        this.ball.x -= 5.0;
    }

    handleBallCollision(player, ball) {
        this.lives--;
        this.updateHeartBar();
        ball.destroy();

        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    updateHeartBar() {
        this.heartBarImage.setTexture(`heartBar${this.lives}`);
    }

    gameOver() {
        this.physics.pause();
        this.player.setTint(0xff0000);
    }
}