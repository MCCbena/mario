import {Enemy} from "./Enemy.js";
import * as THREE from "three";
import {Player} from "./Player.js";

/* #NBTでサポートされている値
g:               Number    落下スピードを設定します。
 */
class FallStdEnemy extends Enemy{
    constructor(scale, nbt) {
        super([0.6, 0.7], scale, 10, new THREE.MeshNormalMaterial(), nbt);
        this.gravityProperties.g = this.getNBTsafe("g", 9.8*2);
    }

    entityLandingEvent(e) {
        this.kill();
    }

    //プレイヤーが敵に触れたら殺す
    entityContactEvent(e) {
        if(e.getTouchedEntity instanceof Player) {
            const player = e.getTouchedEntity;
            player.kill();
        }
    }
}

export {FallStdEnemy};