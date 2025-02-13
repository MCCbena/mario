import * as THREE from "three"
import {Entity} from "./Entity.js";
import {Player} from "./Player.js";
import {Floor} from "../block/Floor.js";

class InvisibleBlock extends Entity{
    #material;
    #isVisible = false;
    constructor(scale, nbt) {
        const material = new THREE.MeshNormalMaterial();
        material.transparent = true;
        material.opacity = 0
        super([1, 1], scale, 1, material, nbt);

        this.#material = material;
    }

    entityContactEvent(e) {
        if(e.getTouchedEntity instanceof Player){
            const player = e.getTouchedEntity;
            if(player.gravityProperties.state==="flying") {
                this.#isVisible = true;
                player.setPosition(player.getPosition.x, this.getPosition.y - 1);
                this.world.setBlockObject(new Floor(this.scale, {"temporary":true}), this.getPosition.x, this.getPosition.y);
            }
        }
    }
}

export {InvisibleBlock};