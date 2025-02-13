import {Entity} from "./Entity.js";
import {Player} from "./Player.js";
import * as THREE from "three";

class Midpoint extends Entity {
    constructor(scale, nbt) {
        const material = new THREE.MeshBasicMaterial({color:0xfff});
        super([0.6, 1.2], scale, 1, material, nbt);
    }

    entityContactEvent(e) {
        if(e.getTouchedEntity instanceof Player){
            const player = e.getTouchedEntity;
            player.spawnX = this.getPosition.x;
            player.spawnY = this.getPosition.y;
            this.kill();
        }
    }
}

export {Midpoint};