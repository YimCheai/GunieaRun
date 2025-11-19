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
      console.log('Font loading failed:', error);
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

    // 체리 UI
    this.cherryPointTXT = this.add.text(887, 968, ` x ${this.player.cherry_point}`, {
      fontFamily: this.font_04B, 
      fontSize: 40, 
      color: '#FFFFFF', 
      stroke: '#000000', 
      strokeThickness: 8
    }).setScrollFactor(0).setDepth(1000);
    
    this.cherryImage = this.add.image(773, 935, 'cherry')
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(1000);

    // 라이프 UI
    this.lifeTXT = this.add.text(41, 39, 'LIFE', {
      fontFamily: this.font_04B, 
      fontSize: 40, 
      color: '#FFFFFF', 
      stroke: '#000000', 
      strokeThickness: 8
    }).setScrollFactor(0).setDepth(1000);
    
    this.heartBarImage = this.add.image(20, 26, 'heartBar')
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(1000);

    // 점수 UI
    this.scoreTXT = this.add.text(1697, 915, 'SCORE', {
      fontFamily: this.font_04B, 
      fontSize: 40, 
      color: '#FFFFFF', 
      stroke: '#000000', 
      strokeThickness: 8
    }).setScrollFactor(0).setDepth(1000);
    
    this.scorePointTXT = this.add.text(1627, 965, `${this.player.point}`, {
      fontFamily: this.font_04B, 
      fontSize: 50, 
      color: '#FFFFFF', 
      stroke: '#000000', 
      strokeThickness: 8
    }).setScrollFactor(0).setDepth(1000);

    // 게임 오버 UI (초기에는 숨김)
    this.gameOverText = this.add.text(
      this.scale.width / 2, 
      this.scale.height / 2, 
      'GAME OVER', 
      {
        fontFamily: this.font_04B,
        fontSize: 80,
        color: '#FF0000',
        stroke: '#000000',
        strokeThickness: 10
      }
    ).setOrigin(0.5)
     .setScrollFactor(0)
     .setDepth(2000)
     .setVisible(false);

    this.restartText = this.add.text(
      this.scale.width / 2, 
      this.scale.height / 2 + 100, 
      'Press SPACE to Restart', 
      {
        fontFamily: this.font_04B,
        fontSize: 40,
        color: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 8
      }
    ).setOrigin(0.5)
     .setScrollFactor(0)
     .setDepth(2000)
     .setVisible(false);
  }

  // 랜덤 패턴 선택
  getRandomPattern() {
    const index = Phaser.Math.Between(0, this.chunkPatterns.length - 1);
    return this.chunkPatterns[index];
  }

  // 청크 생성
  spawnChunk(pattern, startX) {
    const grounds = [];
    const objects = [];

    // 땅 생성
    pattern.cols.forEach((hasGround, index) => {
      if (!hasGround) return;
      
      const x = startX + index * this.SEGMENT_WIDTH;
      const ground = new Ground(this, x, this.GROUND_Y);
      ground.setDepth(10);
      
      this.grounds.add(ground);
      grounds.push(ground);
    });

    // 아이템 생성
    if (pattern.items && pattern.items.length > 0) {
      pattern.items.forEach(({ type, col, dy }) => {
        const factory = this.objectFactories[type];
        if (!factory) {
          console.log(`Unknown object type: ${type}`);
          return;
        }
        
        // 해당 열에 땅이 있는지 확인
        if (pattern.cols[col] !== 1) {
          console.log(`Item at col ${col} has no ground`);
          return;
        }
        
        const x = startX + col * this.SEGMENT_WIDTH + this.SEGMENT_WIDTH * 0.5;
        const y = this.GROUND_Y + (dy || 0);
        const obj = factory(this, x, y);
        obj.setDepth(20);
        
        this.objects.add(obj);
        objects.push(obj);
      });
    }

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

  // 청크 재활용
  recycleChunk(oldChunk, newStartX) {
    // 기존 오브젝트 제거
    this.destroyChunk(oldChunk);

    // 새 패턴으로 청크 생성
    const pattern = this.getRandomPattern();
    const newChunk = this.spawnChunk(pattern, newStartX);

    // 배열에서 교체
    const index = this.chunks.indexOf(oldChunk);
    if (index >= 0) {
      this.chunks[index] = newChunk;
    }

    return newChunk;
  }

  // 초기 청크 생성
  generateInitialChunks() {
    const screenWidth = this.scale.width;
    const bufferChunks = 3;
    
    // 화면을 채우고도 여유있게 청크 생성
    const targetWidth = screenWidth + (bufferChunks * this.SEGMENT_WIDTH * 4);
    let currentX = this.START_X;
    
    while (currentX - this.START_X < targetWidth) {
      const pattern = this.getRandomPattern();
      const chunk = this.spawnChunk(pattern, currentX);
      currentX += chunk.width;
    }
    
    console.log(`Initial chunks created: ${this.chunks.length}`);
  }

  // 오브젝트 충돌 처리
  handleObjectCollision(obj) {
    const type = obj.getData('type');
    
    if (type === 'cherry') {
      obj.destroy();
      this.player.cherry_point += 1;
      this.player.point += 10;
      this.cherryPointTXT.setText(` x ${this.player.cherry_point}`);
      this.scorePointTXT.setText(`${this.player.point}`);
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
    }
  }
  
}

export default Start;