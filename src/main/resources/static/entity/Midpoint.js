import {Entity} from "./Entity.js";
import {Player} from "./Player.js";

class Midpoint extends Entity {
    constructor(scale, nbt) {
        super([0.6, 1.2], scale, 1, nbt);
    }

    entityContactEvent(e) {
        if(e.getTouchedEntity instanceof Player){
            const player = e.getTouchedEntity;
            player.spawnX = this.getPosition.x;
            player.spawnY = this.getPosition.y;
        }
    }
}

export {Midpoint};