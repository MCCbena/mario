import {Entity} from "./Entity.js";
import {Player} from "./Player.js";

class Enemy extends Entity{
    constructor(scale, nbt) {
        super([0.6, 0.6], scale, 10, nbt);
        this.gravityProperties.g = 9.8;
        this.moving=0.05;

        this.time = new Date().getTime();
        this.addTickLoop(this.loop_move.bind(this));
    }

    entityInstanceLoopEvent(e) {

        if(this.world.scene.camera !== null) {
            const cameraPos = this.world.scene.camera.onCameraPosition(this.getPosition.x, this.getPosition.y, this.bodySize.x/2, this.bodySize.y/2);
            if(this.getPosition.x !== cameraPos[0] || this.getPosition.y !== cameraPos[1]) {
                e.setCanceled = true;
            }
        }
    }

    loop_move(){

        for (let rightElement of this.getHitInBlock().right) {
            if(rightElement.hitbox){
                this.moving = -this.moving;
                console.log("change");
            }
        }

        for (let leftElement of this.getHitInBlock().left) {
            if(leftElement.hitbox){
                this.moving = -this.moving;
                console.log("change1");
            }
        }
        if (new Date().getTime() - this.time > 10) this.addPosition(this.moving, 0);
    }
}

export {Enemy};