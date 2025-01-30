import {Entity} from "./Entity.js";
import {Player} from "./Player.js";

class Enemy extends Entity{
    constructor(scale) {
        super([0.6, 0.6], scale);
        this.gravityProperties.g = 2;
        this.moving=0.1;

        this.addTickLoop(this.loop_move.bind(this));
    }

    loop_move(){
        for (let rightElement of this.getHitInBlock().right) {
            if(rightElement.getType.hitbox){
                this.moving = -this.moving;
            }
        }

        for (let leftElement of this.getHitInBlock().left) {
            if(leftElement.getType.hitbox){
                this.moving = -this.moving;
            }
        }
        this.addPosition(this.moving, 0);
    }

    entityContactEvent(e) {
        const entity = e.getTouchedEntity;
        if(entity instanceof Player){
            if(!entity.gravityProperties.fallStart) entity.kill();
            else {
                if(entity.gravityProperties.initialSpeed === 0) entity.jump(2);
                this.kill();
            }
        }
    }
}

export {Enemy};