import {Entity} from "./Entity.js";
import {isDown} from "../micro-util.js";
import {deathCount, init, minusLife, renderer} from "../index.js";
import {callLifeUI} from "../specialScenes/displayLifeUI.js";
import {getEntity} from "../world-object.js";
import {Enemy} from "./Enemy.js";
import {Air} from "../block/Air.js";

/* #NBTでサポートされている値
savePointX: Number  X軸のスポーン位置を設定します。
savePointY: Number  Y軸のスポーン位置を設定します。
 */
class Player extends Entity {
    spawnX;
    spawnY;

    constructor(scale, nbt={}) {
        const material = new THREE.MeshNormalMaterial();
        super([0.6, 1], scale, 10, material, nbt);
        this.gravityProperties.g = 9.8;

        this.addTickLoop(this.key_move.bind(this));
    }

    addPosition(x, y) {
        if(this.world.scene !== null){
            if(this.world.scene.camera !== null){
                const position = this.world.scene.camera.onCameraPosition(this.getPosition.x+x, this.getPosition.y+y, this.bodySize.x/2, this.bodySize/2);
                x = position[0]-this.getPosition.x;
                y = position[1]-this.getPosition.y;
            }
        }
        super.addPosition(x, y);
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
            if(!this.gravityProperties.fallStart){
                this.jump(2);
            }
        }
        if(isDown("k")&&this.killed === undefined){
            this.killed = true;
            this.kill();
        }
    }

    entityContactEvent(e) {
        if(e.getTouchedEntity instanceof Enemy) {
            const entity = e.getTouchedEntity;
            if (!this.gravityProperties.fallStart) {
                this.kill();
            } else {
                this.setPosition(this.getPosition.x, entity.getPosition.y + entity.bodySize.y);
                this.jump(this.gravityProperties.initialSpeed + 1.5);
                entity.kill();
            }
        }
    }

    entitySpawnEvent(e) {
        this.spawnX = e.spawnX;
        this.spawnY = e.spawnY;
    }

    entityDeathEvent(e) {
        console.log("death");
        e.setCanceled = true;
        minusLife();

        //現ワールドのエンティティをキル

        const deleteEntities = [];
        this.world.entities.forEach(entity=>deleteEntities.push(entity));
        deleteEntities.forEach(temp=>{
            if(!(temp instanceof Player)){
                temp.kill();
            }
        });
        //現在のワールドのレンダリングを停止し、死亡UIをレンダリング
        this.world.scene.stopRender();
        const camera = this.world.scene.camera;
        const world = callLifeUI(renderer, this.scale, camera.getWidth, camera.getHeight);

        //プレイヤーの再スポーン位置をセット
        this.setPosition(this.getNBTsafe("savePointX", this.spawnX), this.getNBTsafe("savePointY", this.spawnY));
        camera.reToggle();

        this.time = new Date().getTime();
        //死亡UIのティックループに追加
        world.scene.addTickLoop(function () {
            //2000ms経過するまで死亡UIを表示
            if(new Date().getTime()-this.time > 2000){
                //死亡UIのレンダリングを停止
                world.scene.stopRender();

                //現ワールドのレンダリングを再開し、エンティティを再召喚
                this.world.scene.restartRender();


                getEntity(this.world.name, this.scale).then(entities=>{
                    entities.forEach(entity=>{
                        if(!(entity instanceof Player)) {
                            this.world.spawnEntity(entity.instance, entity.spawn[0], entity.spawn[1]);
                        }
                    });
                });


                //ワールド内の一時ブロックを削除
                for (let x = 0; x < this.world.getWidth; x++) {
                    for (let y = 0; y < this.world.getHeight; y++) {
                        if(this.world.getBlockObject(x, y).getNBTsafe("temporary", false)){
                            this.world.removeBlockObject(x, y);
                        }
                    }
                }
            }
        }.bind(this));
    }
}

export {Player};