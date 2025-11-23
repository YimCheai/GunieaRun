import Object from "./Object.js"

export default class Ground extends Object {
    constructor(scene,x,y, img = 'ground'){
        super(scene, x, y, img);

        this.body.setOffset(0, 200);
        this.body.immovable = true;
        this.body.allowGravity = false;
    }
    
}