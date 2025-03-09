import {Enemy} from "./Enemy.js";
import * as THREE from "three";
import {Player} from "./Player.js";

/* #NBTでサポートされている値
speedX:           Number    エンティティのx座標のスピードを設定できます。
speedY:           Number    エンティティのy座標のスピードを設定できます。
sizeX:            Number    エンティティのサイズを指定します。
sizeY:            Number    エンティティのサイズを指定します。
 */
class MovingPole extends Enemy{
    constructor(scale, nbt) {
        const material = new THREE.MeshNormalMaterial();
        let sizeX=2, sizeY=0.6;
        if(nbt.sizeX !== undefined){
            sizeX=nbt.sizeX;
        }
        if(nbt.sizeY !== undefined){
            sizeY=nbt.sizeY;
        }
        super([sizeX, sizeY], scale, 10, material, nbt);
        this.movingX = this.getNBTsafe("speedX", 0)/16;
        this.movingY = this.getNBTsafe("speedY", 0)/16;

        this.addTickLoop(this.loop_move.bind(this));
    }

    loop_move(){
        const current = new Date();
        if(this.date_before === undefined) {
            this.date_before = current;
            return;
        }
        const elapsedTime = current.getTime()- this.date_before;

        const moveX = this.movingX*elapsedTime; //16ミリ秒で0.1動くイメージ(0.1/16=0.00625)
        if(Math.abs(moveX*this.scale)<1 && this.movingX !== 0) return;

        const moveY = this.movingY*elapsedTime;
        if(Math.abs(moveY*this.scale)<1 && this.movingY !== 0) return;

        this.date_before = current;

        this.addPosition(moveX, moveY);
    }

    //プレイヤーが敵に触れたら殺す
    entityContactEvent(e) {
        if(e.getTouchedEntity instanceof Player) {
            const player = e.getTouchedEntity;
            player.kill();
        }
    }

    //重力を作る関数をオーバーライドして重力を無効化
    applyGravity() {}
}

export {MovingPole};