import Player from '../Object/Player.js';
import Ground from '../Object/Ground.js';
import Item from '../Object/Item.js';

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('ground', 'assets/ground2.png');
        this.load.image('cherry', 'assets/cherry.png');
    }

    create() {
        console.log("Start scene created");
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // 배경
        this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background').setOrigin(0, 0);

        // 플레이어
        this.player = new Player(this, 34, 0);

        // 땅 생성
        this.grounds = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        let groundX = 217;
        for (let i = 0; i < 6; i++) {
            const ground = new Ground(this, groundX, 877);
            this.grounds.add(ground);
            groundX += 433;
        }

        // 아이템
        this.cherry = new Item(this, 371, 677);

        // UI 테스트
        this.peachTXT = this.add.text(1696, 39, 'test', {
            fontFamily: '04B',
            fontSize: '64px',
            fill: '#FFF',
            stroke: '#000',
            strokeThickness: 8
        });

        // 충돌 설정
        this.physics.add.collider(this.player, this.grounds);
    }

    update() {
        this.background.tilePositionX += 1.5;
        this.player.jump(this.spaceKey);

        // 땅 움직이기 (스크롤)
        this.grounds.children.iterate(ground => {
            ground.x -= 1.5;
            ground.body.updateFromGameObject();
        });
    }
}