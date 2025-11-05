import Object from "./Object.js"

export default class Item extends Object{
    constructor(scene, x, y, img) {
        super(scene, x, y, img);

        this.body.immovable = true;
        this.body.allowGravity = false;
    }

    
}