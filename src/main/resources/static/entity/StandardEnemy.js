import {Enemy} from "./Enemy.js";
import * as THREE from "three";

/* #NBTでサポートされている値
speed:           Number    エンティティのスピードを設定できます。
 */
class StandardEnemy extends Enemy{
    constructor(scale, nbt) {
        const material = new THREE.MeshNormalMaterial();
        super([0.6, 0.6], scale, 10, material, nbt);

        this.moving=this.getNBTsafe("speed", 0.05)/16;
        this.addTickLoop(this.loop_move.bind(this));
    }


    loop_move(){
        const current = new Date();
        if(this.date_before === undefined) {
            this.date_before = current;
            return;
        }
        const elapsedTime = current.getTime()- this.date_before;

        const move = this.moving*elapsedTime; //16ミリ秒で0.1動くイメージ(0.1/16=0.00625)
        if(Math.abs(move*this.scale)<1) return;
        this.date_before = current;

        for (let rightElement of this.getHitInBlock().right) {
            if(rightElement.hitbox){
                this.moving = -Math.abs(this.moving);
                console.log("change");
            }
        }

        for (let leftElement of this.getHitInBlock().left) {
            if(leftElement.hitbox){
                this.moving = Math.abs(this.moving);
                console.log("change1");
            }
        }
        this.addPosition(move, 0);
    }

    entityInstanceLoopEvent(e) {
        super.entityInstanceLoopEvent(e);
        if(e.getCanceled) this.date_before = undefined;
    }
}

export {StandardEnemy}