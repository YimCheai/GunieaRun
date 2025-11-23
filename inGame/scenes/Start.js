import Player from '../object/Player.js';
import Ground from '../object/Ground.js';
import Item from '../object/Item.js';
import Cherry from '../object/Cherry.js';

export class Start extends Phaser.Scene {
  constructor() {
    super('Start');
    this.font_04B = '"04B"';

    // 게임 기본 설정
    this.SEGMENT_WIDTH = 433;    // 땅 타일 하나의 너비
    this.GROUND_Y = 877;         // 땅의 Y 좌표
    this.START_X = 217;          // 시작 X 좌표
    this.SCROLL_SPEED = 1.5;     // 스크롤 속도

    // 청크 패턴 정의 (1=땅, 0=빈칸)
    this.chunkPatterns = [
      // 안전한 패턴
      { cols: [1, 1, 1], items: [{ type: 'cherry', col: 1, dy: -200 }] },
      { cols: [1, 1], items: [{ type: 'cherry', col: 0, dy: -180 }] },
      { cols: [1, 0, 1], items: [{ type: 'cherry', col: 2, dy: -200 }] },
      { cols: [1, 1, 0, 1], items: [] },
      { cols: [1, 0, 1, 1], items: [{ type: 'cherry', col: 0, dy: -150 }] },
      
      // 점프 필요한 패턴
      { cols: [1, 0, 1, 1], items: [{ type: 'cherry', col: 2, dy: -220 }] },
      { cols: [1, 1, 1, 0, 1], items: [{ type: 'cherry', col: 4, dy: -200 }] },
      { cols: [1, 0, 1], items: [] },
      
      // 연속 땅
      { cols: [1, 1, 1, 1], items: [
        { type: 'cherry', col: 1, dy: -180 },
        { type: 'cherry', col: 3, dy: -200 }
      ]},
      { cols: [1, 1], items: [] },

      // 피치 패턴
      { cols: [1, 1, 1], items: [{ type: 'peach', col: 2, dy: -220 }] },
      { cols: [1, 0, 1, 0, 1], items: [
        { type: 'peach', col: 0, dy: -240 },
        { type: 'cherry', col: 4, dy: -180 }
      ]},
      { cols: [1, 1, 1, 1, 1], items: [{ type: 'peach', col: 2, dy: -260 }] }
    ];

    // 오브젝트 생성 팩토리 (확장 가능)
    this.objectFactories = {
      cherry: (scene, x, y) => {
        const sprite = scene.physics.add.image(x, y, 'cherry');
        sprite.setData('type', 'cherry');
        sprite.setImmovable(true);
        sprite.body.allowGravity = false;
        return sprite;
      },
      peach: (scene, x, y) => {
        const sprite = scene.physics.add.image(x, y, 'peach');
        sprite.setData('type', 'peach');
        sprite.setImmovable(true);
        sprite.body.allowGravity = false;
        return sprite;
      }
    };

    // 활성화된 청크 목록
    this.chunks = [];
    
    // 게임 상태
    this.isGameOver = false;
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
    console.log('Start scene created');
    
    // 키 입력 설정
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // 배경 생성
    this.background = this.add
      .tileSprite(0, 0, this.scale.width, this.scale.height, 'background')
      .setOrigin(0, 0)
      .setDepth(-100);

    // 플레이어 생성
    this.player = new Player(this, 34, 0);

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

    // 물리 그룹 생성
    this.grounds = this.physics.add.group({ 
      allowGravity: false, 
      immovable: true 
    });
    
    this.objects = this.physics.add.group({ 
      allowGravity: false, 
      immovable: true 
    });

    // 폰트 로드
    try {
      await document.fonts.load('400 40px "04B"');
    } catch (error) {
      console.warn('Font loading failed:', error);
    }

    // UI 생성
    this.createUI();

    // 충돌 설정
    this.physics.add.collider(this.player, this.grounds);

    // 아이템/장애물 오버랩 처리
    this.physics.add.overlap(this.player, this.objects, (player, obj) => {
      this.handleObjectCollision(obj);
    });

    // 초기 청크 생성
    this.generateInitialChunks();
  }

        this.playerPlatforms = this.physics.add.staticGroup();
        this.playerPlatforms.create(0, 877).setOrigin(0, 0).setSize(this.scale.width * 2, 10).setVisible(false);


        let groundX = 217;
        for (let i = 0; i < 100; i++) {
            const ground = new Ground(this, groundX, 877);
            this.grounds.add(ground);
            groundX += 433;
        }
  // UI 생성 함수
  createUI() {
    // 피치 UI
    this.peachPointTXT = this.add.text(1696, 111, `${this.player.peach_point} x `, {
      fontFamily: this.font_04B, 
      fontSize: 40, 
      color: '#FFFFFF', 
      stroke: '#000000', 
      strokeThickness: 8
    }).setScrollFactor(0).setDepth(1000);
    
    this.peachTXT = this.add.text(1696, 39, 'PEACH', {
      fontFamily: this.font_04B, 
      fontSize: 40, 
      color: '#FFFFFF', 
      stroke: '#000000', 
      strokeThickness: 8
    }).setScrollFactor(0).setDepth(1000);
    
    this.peachImage = this.add.image(1779, 56, 'peach')
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(1000);

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
    // 청크 메타데이터 생성
    const width = pattern.cols.length * this.SEGMENT_WIDTH;
    const chunk = { 
      leftX: startX, 
      width, 
      grounds, 
      objects 
    };
    
    this.chunks.push(chunk);
    return chunk;
  }

  // 청크 제거
  destroyChunk(chunk) {
    chunk.grounds.forEach(ground => {
      if (ground && ground.active) {
        ground.destroy();
      }
    });
    
    chunk.objects.forEach(obj => {
      if (obj && obj.active) {
        obj.destroy();
      }
    });
  }


    else if (type === 'peach') {
      obj.destroy();
      this.player.peach_point += 1;
      this.player.point += 20;
      this.peachPointTXT.setText(`${this.player.peach_point} x `);
      this.scorePointTXT.setText(`${this.player.point}`);
    }
  }

  // 게임 오버 처리
  gameOver() {
    if (this.isGameOver) return;
    
    this.isGameOver = true;
    this.gameOverText.setVisible(true);
    this.restartText.setVisible(true);
    
    // 플레이어 물리 정지
    if (this.player.body) {
      this.player.body.setVelocity(0, 0);
      this.player.body.setAcceleration(0, 0);
    }
    
    console.log('Game Over! Final Score:', this.player.point);
  }

  update() {
    // 게임 오버 상태 처리
    if (this.isGameOver) {
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.scene.restart();
      }
      return;
    }

    // 플레이어가 화면 아래로 떨어지면 게임 오버
    if (this.player.y > this.scale.height + 100) {
      this.gameOver();
      return;
    }

    const dx = this.SCROLL_SPEED;

    // 배경 스크롤
    this.background.tilePositionX += dx;

    // 플레이어 점프
    this.player.jump(this.spaceKey);

    // 모든 땅 이동
    this.grounds.children.iterate(ground => {
      if (ground && ground.active) {
        ground.x -= dx;
        if (ground.body) {
          ground.body.updateFromGameObject();
        }
      }
    });

    // 모든 오브젝트 이동
    this.objects.children.iterate(obj => {
      if (obj && obj.active) {
        obj.x -= dx;
        if (obj.body) {
          obj.body.updateFromGameObject();
        }
      }
    });

    // 청크 위치 업데이트
    this.chunks.forEach(chunk => {
      chunk.leftX -= dx;
    });

    // 가장 오른쪽 끝 찾기
    let rightmostEdge = -Infinity;
    this.chunks.forEach(chunk => {
      const rightEdge = chunk.leftX + chunk.width;
      if (rightEdge > rightmostEdge) {
        rightmostEdge = rightEdge;
      }
    });

    // 화면 왼쪽을 벗어난 청크를 오른쪽으로 재활용
    for (let i = 0; i < this.chunks.length; i++) {
      const chunk = this.chunks[i];
      
      // 청크가 완전히 화면 왼쪽 밖으로 나갔는지 확인
      if (chunk.leftX + chunk.width < -this.SEGMENT_WIDTH) {
        const newChunk = this.recycleChunk(chunk, rightmostEdge);
        rightmostEdge += newChunk.width;
      }
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
}