import * as THREE from "three";
import {Enemy} from "./Enemy.js";
import {Player} from "./Player.js";
import {EntityContactEvent} from "../Events/EntityContactEvent.js";

/* #NBTでサポートされている値
sizeX:           Number    X軸に何ブロック分かの大きさを指定します。
sizeY:           Number    Y軸に何ブロック文化の大きさを指定します。
texture:         String    テクスチャのパスを指定します。
g:               Number    落下スピードを設定します。
 */
class FallBlock extends Enemy{
    constructor(scale, nbt) {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(nbt.texture, function ( texture ) {

            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( nbt.sizeX, nbt.sizeY );

        } );
        texture.colorSpace = THREE.SRGBColorSpace;

        const material = new THREE.MeshBasicMaterial({map: texture});

        super([nbt.sizeX, nbt.sizeY], scale, 10, material, nbt);
        this.gravityProperties.g = this.getNBTsafe("g", 9.8);
        this.loopCancel = true;
        this.playerCrush = false;
        this.playerFallBlock = false;

    }

    /**
     * エンティティと接触したときに発動するentityContactEventの発生を制御するメソッド
     * @param x {Number}
     * @param y {Number}
     *
     * @returns {boolean} イベントが実行したか
     */
    #callContactEvent(x, y){
        for (const entitiesKey of this.world.entities) {
            if(entitiesKey !== this){
                const threshold_x = entitiesKey.bodySize.x/2 + this.bodySize.x/2;
                const threshold_y = entitiesKey.bodySize.y/2 + this.bodySize.y/2;
                if(Math.abs(entitiesKey.getPosition.x - x) < threshold_x && Math.abs(entitiesKey.getPosition.y - y) < threshold_y){
                    this.entityContactEvent(new EntityContactEvent(entitiesKey));
                    return true;
                }
            }
        }
        return false;
    }

    entityInstanceLoopEvent(e) {
        if(!this.playerFallBlock) {
            this.#callContactEvent(this.getPosition.x, this.getPosition.y); //loopEventをキャンセルしているためContactEventが呼び出されない。それを回避する。
            this.world.entities.forEach(entity => {
                if (entity instanceof Player) {
                    if (Math.abs(entity.getPosition.x - this.getPosition.x) < this.bodySize.x / 2 && this.getPosition.y - entity.getPosition.y > 0) {
                        this.loopCancel = false;
                        this.playerCrush = true;
                    }
                }
            });

            e.setCanceled = this.loopCancel;
        }
    }

    entityLandingEvent(e) {
        this.kill();
    }

    entityContactEvent(e) {
        if(e.getTouchedEntity instanceof Player) {
            const player = e.getTouchedEntity;
            if(this.playerCrush) player.kill();
            else{
                this.loopCancel = false;
                this.setPosition(this.getPosition.x, player.getPosition.y-player.bodySize.y);
            }
        }
    }
}

export {FallBlock};