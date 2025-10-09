export default class Object extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, img, isStatic = false) {
        super(scene, x, y, img);
        
        scene.add.existing(this);
        scene.physics.add.existing(this, isStatic);
    }
}