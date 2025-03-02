import {Entity} from "./Entity.js";
import {isDown} from "../micro-util.js";
import {minusLife, renderer} from "../index.js";
import {callLifeUI} from "../specialScenes/displayLifeUI.js";
import {getEntity, getWorld} from "../worldUtil/world-object.js";
import {Material} from "../block/Material.js";
import * as THREE from "three";
import {Invisible} from "../block/Invisible.js";
import {Brick} from "../block/Brick.js";
import {BrittleBrick} from "../block/BrittleBrick.js";
import {HatenaBox} from "../block/HatenaBox.js";

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

        this.date_before = new Date();
        this.addTickLoop(this.key_move.bind(this));
        this.addTickLoop(this.touchCheck.bind(this));
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
        const current = new Date();
        const elapsedTime = current.getTime()- this.date_before;

        const move = 0.00625*elapsedTime; //16ミリ秒で0.1動くイメージ(0.1/16=0.00625)
        if(move*this.scale<1) return;
        this.date_before = current;
        if(isDown("d")){
            if(!this.isHitInWorldObject("right")) {
                this.addPosition(move, 0);
            }
        }
        if(isDown("a")){
            if(!this.isHitInWorldObject("left")) {
                this.addPosition(-move, 0);
            }
        }
        if(isDown("w")){
            if(!this.gravityProperties.fallStart){
                this.jump(20);
            }
        }
        if(isDown("k")&&this.killed === undefined){
            this.killed = true;
            this.kill();
        }

        if(isDown("o")){
            console.log(this.getPosition);
        }
    }

    /**
     * ブロックに触れたかどうかを判断する関数です。
     */
    touchCheck(){
        const hitBlocks = this.getHitInBlock();
        hitBlocks.top.forEach(block=>{

            //不可視ブロック頭を打ったか判断します。
            if(block instanceof Invisible){
                this.addPosition(0, -0.1);
                if(this.gravityProperties.state === "flying") block.display();
            }

            //レンガブロックに頭を打ったか判断します。
            if(block instanceof Brick){
                if(this.gravityProperties.state === "flying") this.world.removeBlockObject(block.x, block.y);
            }

            //ハテナボックスに頭を打ったか
            if(block instanceof HatenaBox){
                block.touch();
            }
        });

        hitBlocks.bottom.forEach(block=>{

            //脆いレンガブロックに着地したか判断します
            if(block instanceof BrittleBrick){
                if(this.gravityProperties.state === "fall") this.world.removeBlockObject(block.x, block.y);
            }
        });
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
        const lifeUI = callLifeUI(renderer, this.scale, camera.getWidth, camera.getHeight);

        //プレイヤーの再スポーン位置をセット
        this.setPosition(this.getNBTsafe("savePointX", this.spawnX), this.getNBTsafe("savePointY", this.spawnY));
        camera.reToggle();

        this.time = new Date().getTime();
        //死亡UIのティックループに追加
        lifeUI.scene.addTickLoop(function () {
            //2000ms経過するまで死亡UIを表示
            if(new Date().getTime()-this.time > 2000){

                //エンティティを再設置
                getEntity(this.world.name, this.scale).then(entities=>{
                    entities.forEach(entity=>{
                        if(!(entity instanceof Player)) {
                            this.world.spawnEntity(entity.instance, entity.spawn[0], entity.spawn[1]);
                        }
                    });
                });

                //ワールドブロックを再設置
                getWorld(this.world.name, this.scale).then(worldData=>{
                    const json = worldData[1];
                    json.stage.forEach(stage=>{
                        this.world.setBlockObject(new (Material.getMaterial(stage.type).properties.class)(this.scale, stage.nbt), stage.x, stage.y);
                    });
                });
                //死亡UIのレンダリングを停止
                lifeUI.scene.stopRender();
                lifeUI.clear();
                //現ワールドのレンダリングを再開し、エンティティを再召喚
                this.world.scene.restartRender();
            }
        }.bind(this));
    }
}

export {Player};