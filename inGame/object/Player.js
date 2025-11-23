import Object from "./Object.js"

export default class Player extends Object {
    constructor(scene,x,y){
        super(scene, x, y, 'player');
        this.setOrigin(0,0);


        this.life = 3;
        this.cherry_point = 0;
        this.peach_point = 0;
        this.point = 0;
    }

    jump(spaceKey){
        if (spaceKey.isDown && this.body.touching.down){
            this.setVelocityY(-750);
            this.setVelocityY(-900);
        }
    }
}