import {Entity} from "./Entity.js";
import {Player} from "./Player.js";
import {Actor} from "./Actor.js";
import * as THREE from "three";

/* #NBTでサポートされている値
entityID         Number    召喚するエンティティのIDを指定します。
spawnX           Number    エンティティの召喚位置Xを指定します。
spawnY           Number    エンティティの召喚位置Yを指定します。
sizeX:           Number    当たり判定の大きさXを指定します。
sizeY:           Number    当たり判定の大きさYを指定します。
 */
class SpawnInTheSky extends Entity{
    constructor(scale, nbt) {
        super([nbt.sizeX === undefined ? 1:nbt.sizeX, nbt.sizeY === undefined ? 1:nbt.sizeY], scale, 10, new THREE.MeshNormalMaterial({transparent: true, opacity: 1}), nbt);
    }

    entityContactEvent(e) {
        if(e.getTouchedEntity instanceof Player){
            this.world.spawnEntity(new (Actor.getActor(this.getNBTsafe("entityID", Actor.FallStdEnemy.properties.id)).properties.class)(this.scale, {}), this.getNBTsafe("spawnX", this.getPosition.x), this.getNBTsafe("spawnY", this.getPosition.y+10));
            this.kill();
        }
    }
}

export {SpawnInTheSky};