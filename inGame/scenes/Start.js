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
        this.items = this.physics.add.group();
        const cherry = new Cherry(this, 371, 677);
        this.items.add(cherry);
        const peach = new Item(this, 800, 677, 'peach');
        peach.setDisplaySize(104, 94); // Assuming similar size to cherry
        this.items.add(peach);

        // UI
        
        await document.fonts.load('400 40px "04B"');

        this.lifeTXT = this.add.text(41, 39, "LIFE", {
            fontFamily: this.font_04B,
            fontSize: 40,
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 8
        });
        
        this.heartBarImage = this.add.image(20, 26, 'heartBar')
            .setOrigin(0, 0);

        this.scoreTXT = this.add.text(1879, 39, `SCORE`, {
            fontFamily: this.font_04B,
            fontSize: 40,
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(1, 0);

        this.scorePointTXT = this.add.text(1879, 89, `${this.player.point}`, {
            fontFamily: this.font_04B,
            fontSize: 50,
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(1, 0);

        // 충돌 설정
        this.physics.add.collider(this.player, this.grounds);

        //item overlap
        this.physics.add.overlap(this.player, this.items, (player, item)=> {
            if (item.texture.key === 'cherry') {
                player.point += 10;
            } else if (item.texture.key === 'peach') {
                player.point += 20;
            }
            item.destroy();
            this.scorePointTXT.setText(`${player.point}`);
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
        
        this.items.children.iterate(item => {
            if (item) {
                item.x -= 1.5;
            }
        });
    }
}