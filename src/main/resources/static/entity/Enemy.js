import {Entity} from "./Entity.js";

class Enemy extends Entity{
    constructor(scale) {
        super([0.6, 0.6], scale);
        this.gravityProperties.g = 9.8;
        this.moving=0.1;

        this.time = new Date().getTime();
        this.addTickLoop(this.loop_move.bind(this));
    }

    loop_move(){

        for (let rightElement of this.getHitInBlock().right) {
            if(rightElement.getType.properties.hitbox){
                this.moving = -this.moving;
            }
        }

        for (let leftElement of this.getHitInBlock().left) {
            if(leftElement.getType.properties.hitbox){
                this.moving = -this.moving;
            }
        }
        if (new Date().getTime() - this.time > 10) this.addPosition(this.moving, 0);
    }
}

export {Enemy};