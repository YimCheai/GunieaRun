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
        this.load.image('heartBar', 'assets/heartBar.png');
    }

    async create() {
        console.log("Start scene created");
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // 배경
        this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background').setOrigin(0, 0);

        // 플레이어
        this.player = new Player(this, 34, 0);

        // 땅
        this.grounds = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        let groundX = 217;
        for (let i = 0; i < 100; i++) {
            const ground = new Ground(this, groundX, 877);
            this.grounds.add(ground);
            groundX += 433;
        }

        // 아이템
        this.cherry = new Cherry(this, 371, 677);

        // UI
        
        await document.fonts.load('400 40px "04B"');

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

        this.peachImage = this.add.image(1779, 56, 'peach')
            .setOrigin(0, 0);
        
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
        
        this.heartBarImage = this.add.image(20, 26, 'heartBar')
            .setOrigin(0, 0);

        this.scoreTXT = this.add.text(1697, 915, `SCORE`, {
            fontFamily: this.font_04B,
            fontSize: 40,
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 8
        });

        this.scorePointTXT = this.add.text(1627, 965, `${this.player.point}`, {
            fontFamily: this.font_04B,
            fontSize: 50,
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 8
        });

        // 충돌 설정
        this.physics.add.collider(this.player, this.grounds);

        //cherry overlap
        this.physics.add.overlap(this.player, this.cherry, ()=> {
            this.cherry.destroy();
            this.player.cherry_point += 1;
            this.player.point += 10;
            this.cherryPointTXT.setText(` x ${this.player.cherry_point}`);
            this.scorePointTXT.setText(`${this.player.point}`);
        });

        //peach overlap
        this.physics.add.overlap(this.player, this.peach, ()=> {
            this.peach.destroy();
            this.player.peach_point += 1;
            this.player.point += 20;
            this.peachPointTXT.setText(`${this.player.peach_point} x `);
            this.scorePointTXT.setText(`${this.player.point}`);
        });
    }

    update() {
        this.background.tilePositionX += 1.5;

        this.player.jump(this.spaceKey);

        // 땅 움직이기 (스크롤)
        this.grounds.children.iterate(ground => {
            ground.x -= 1.5;
            ground.body.updateFromGameObject();
        });
        
        this.cherry.x -= 1.5;
    }
}