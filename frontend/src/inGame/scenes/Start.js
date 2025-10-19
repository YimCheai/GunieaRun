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

        this.peachPointTXT = this.add.text(1696, 111, `${this.player.cherry_point} x `, {
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


        // 충돌 설정
        this.physics.add.collider(this.player, this.grounds);

        this.physics.add.overlap(this.player, this.cherry, ()=> {
            this.cherry.destroy();
            this.player.cherry_point += 1;
            this.peachPointTXT.setText(`${this.player.cherry_point} x `);

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