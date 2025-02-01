import {Entity} from "./Entity.js";
import {isDown} from "../micro-util.js";

class Player extends Entity {
    constructor(scale) {
        super([0.6, 1], scale);
        this.gravityProperties.g = 9.8

        this.addTickLoop(this.key_move.bind(this));
    }

    key_move(){
        if(isDown("d")){
            if(!this.isHitInWorldObject("right")) {
                this.addPosition(0.1, 0);
            }
        }
        if(isDown("a")){
            if(!this.isHitInWorldObject("left")) {
                this.addPosition(-0.1, 0);
            }
        }
        if(isDown("w")){
            if(this.status.isOnGround){
                this.jump(2);
            }
        }
    }
}

export {Player};