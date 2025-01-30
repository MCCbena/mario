import * as THREE from "three";
import {Material} from "../world-object.js";
import {EntityContactEvent} from "../Events/EntityContactEvent.js";
import {EntityIsOnGroundEvent} from "../Events/EntityIsOnGroundEvent.js";
import {EntityDeathEvent} from "../Events/EntityDeathEvent.js";
import {EntityGravityEvent} from "../Events/EntityGravityEvent.js";

class Entity {
    world;
    sizeX = 0;
    sizeY = 0;
    scale = 0;
    #UUID;

    gravityProperties = {
        "g": 0,
        "fallStartTime": null,
        "fallStart": false,
        "initialSpeed": 0,
        "inertialForce": 0,
    };

    status = {
        "isOnGround": true,
        "isOnCamera": false,
    }

    loopMethods = [];


    loopFunction = function (){
        this.loopMethods.forEach(temp=>{
            if(temp.arg === null){
                temp.method();
            }else{
                temp.method(temp.arg);
            }
        })
    }.bind(this);

    constructor(body_size, scale) {
        this.#UUID = crypto.randomUUID();
        this.sizeX = body_size[0]*scale;
        this.sizeY = body_size[1]*scale;
        const material = new THREE.MeshNormalMaterial();
        const entityGeo = new THREE.BoxGeometry(this.sizeX, this.sizeY, 0);
        this.entity = new THREE.Mesh(entityGeo, material);
        this.scale = scale;
        this.entity.onBeforeRender = () => {
            this.status.isOnCamera=true;
        }

        //イベントハンドラ
        this.addTickLoop(this.#applyGravity.bind(this));
        this.addTickLoop(function () {
            this.status.isOnCamera = false;
            this.status.isOnGround = this.isHitInWorldObject("bottom");
            if(this.status.isOnGround) this.entityIsOnGroundEvent(new EntityIsOnGroundEvent());
        }.bind(this));//エンティティが地面に接触しているとき
        this.addTickLoop(function () { //エンティティと接触した時
            for (const entitiesKey of this.world.entities) {
                if(entitiesKey !== this){
                    const threshold_x = entitiesKey.bodySize.x/2 + this.bodySize.x/2;
                    const threshold_y = entitiesKey.bodySize.y/2 + this.bodySize.y/2;
                    if(Math.abs(entitiesKey.getPosition.x - this.getPosition.x) < threshold_x && Math.abs(entitiesKey.getPosition.y - this.getPosition.y) < threshold_y){
                        this.entityContactEvent(new EntityContactEvent(entitiesKey));
                    }
                }
            }
        }.bind(this));
    }

    get UUID(){
        return this.#UUID;
    }

    //(x, y)
    setPosition(x, y) {
        this.entity.position.set(parseInt(x*this.scale), parseInt((y+(this.bodySize.y/2)-0.5)*this.scale), 0);
    }

    addPosition(x, y) {
        this.entity.position.x += parseInt(x*this.scale);
        this.entity.position.y += parseInt(y*this.scale);
    }

    get getPosition() {
        return {
            "x": parseFloat(this.entity.position.x)/this.scale,
            "y": parseFloat(this.entity.position.y)/this.scale-(this.bodySize.y/2)+0.5
        };
    }

    get bodySize(){
        return {
            "x": parseFloat(this.sizeX)/this.scale,
            "y": parseFloat(this.sizeY)/this.scale
        }
    }

    /**
     *
     * @param method {method}
     * @param arg
     */
    addTickLoop(method, arg=null){
        this.loopMethods.push({
            "method": method,
            "arg": arg
        });
    }

    /**
     * 指定した向きにある特定の範囲の中で当たる可能性があるブロックが存在するか返します
     * @param direction {string} {top/bottom/right/left}
     * @return number
     **/
    getNextBlock(direction){
        const world = this.world;
        const range_height = this.getPosition.y;
        const range_weight = this.getPosition.x;

        const height_offset= 0.1;
        const weight_offset= 0.09;

        //座標計算に必要な計算。なぜこれで求められるかは全くわからん。適当に総当たりしたらできた。
        const right_full = range_weight + (this.bodySize.x/2+0.5);//ボディ右の最大座標
        const left_full = range_weight - (this.bodySize.x/2-0.5);//ボディ左の最大座標
        const top_full = range_height+this.bodySize.y-0.1;//ボディ高さの最大座標

        let min_or_max = -1; //最終的に出力する値を代入
        //bottomとtop用ブロック取得
        switch (direction){
            case "top":
                min_or_max = world.getHeight+1e2;
            case "bottom":
                for (let x = parseInt(left_full); x <= parseInt(right_full); x++) {
                    const blocks = world.getBlockObject(x, null);

                    switch (direction){
                        case "bottom":
                            for (let y = parseInt(range_height-height_offset); y >= 0; y--) {
                                if(blocks[y].getType.properties.hitbox && min_or_max < y){
                                    min_or_max = y;
                                }
                            }
                            break;
                        case "top":
                            for (let y = parseInt(top_full+height_offset); y < blocks.length; y++) {
                                if(blocks[y].getType.properties.hitbox && min_or_max > y){
                                    min_or_max = y;
                                }
                            }
                            break;
                    }
                }
                break;
            case "right":
                min_or_max = world.getWidth+1e2;
            case "left":
                //rightとleft用ブロック取得
                for (let y = parseInt(range_height); y <= parseInt(top_full); y++){
                    const blocks = world.getBlockObject(null, y);

                    switch (direction){
                        case "right":
                            for (let x = parseInt(right_full+weight_offset); x < blocks.length; x++) {
                                if(blocks[x].getType.properties.hitbox && min_or_max > x) {
                                    min_or_max = x;
                                }
                            }
                            break;
                        case "left":
                            for (let x = parseInt(left_full-weight_offset); x >= 0; x--) {
                                if(blocks[x].getType.properties.hitbox && min_or_max < x) {
                                    min_or_max = x;
                                }
                            }
                            break;
                    }
                }
                break;
        }
        return min_or_max;
    }

    /** @return {{
     "bottom": [],
     "right": [],
     "left": [],
     "top": [],
     }} */
    getHitInBlock() {
        const world = this.world;
        const range_height = this.getPosition.y;
        const range_weight = this.getPosition.x;
        
        const height_offset= 0.1;
        const weight_offset= 0.09;

        //座標計算に必要な計算。なぜこれで求められるかは全くわからん。適当に総当たりしたらできた。
        const right_full = range_weight + (this.bodySize.x/2+0.5);//ボディ右の最大座標
        const left_full = range_weight - (this.bodySize.x/2-0.5);//ボディ左の最大座標
        const top_full = range_height+this.bodySize.y-0.1;//ボディ高さの最大座標

        const blocks = {
            "bottom": [],
            "right": [],
            "left": [],
            "top": [],
        };

        //bottomとtop同時計算
        for (let x = parseInt(left_full); x <= parseInt(right_full); x++) {
            //bottom
            blocks.bottom.push(world.getBlockObject(x, parseInt(range_height-height_offset)));
            //top
            blocks.top.push(world.getBlockObject(x, parseInt(top_full+height_offset)));
        }
        //rightとleft同時計算
        for (let y = parseInt(range_height); y <= parseInt(top_full); y++){
            //right
            blocks.right.push(world.getBlockObject(parseInt(right_full+weight_offset), y));
            //left
            blocks.left.push(world.getBlockObject(parseInt(left_full-weight_offset), y));
        }

        return blocks;
    }
    /**
     placeはtop, bottom, left, right
     * @return boolean
     * */
    isHitInWorldObject(place){
        const hitblocks = this.getHitInBlock();

        for (let topElement of hitblocks[place]) {
            if(topElement.getType !== Material.AIR) {
                return true;
            }
        }
        return false;
    }

    #applyGravity(){
        //プレイヤーが落下を開始した時に動作
        if(!this.status.isOnGround && !this.gravityProperties.fallStart) {
            this.gravityProperties.fallStart = true;
            this.gravityProperties.fallStartTime = new Date();  //落下開始時刻を代入
        }

        //空中にいるとき
        if(this.gravityProperties.fallStart) {
            const g = this.gravityProperties.g; //重力加速度を取得
            const t = (new Date().getTime() - this.gravityProperties.fallStartTime.getTime())/1000; //経過時間を秒で取得
            const v0 = this.gravityProperties.initialSpeed/((t+1)*3);
            const y = v0 * t - (0.5 * g * t*t); //自由落下の公式により計算
            const entity_fall_y = this.getPosition.y+y //プレイヤーの座標が何ブロック下になるかを計算

            let state= "flying";
            if (y <= 0) state = "fall";
            //プレイヤーが上昇しているか降下しているかを判定

            if (y <= 0) {
                //落下の当たり判定制御
                const block_y = this.getNextBlock("bottom")
                if(entity_fall_y <= block_y+1){
                    //プレイヤーの座標をブロックの座標+1に設定し、自由落下を解除
                    this.entityGravityEvent(new EntityGravityEvent(this.getPosition.x, block_y+1.01, state, this.gravityProperties.fallStartTime)); //イベントの呼び出し
                    this.setPosition(this.getPosition.x, block_y+1.01);
                    this.gravityProperties.fallStart = false;
                    return;
                }
            } else {
                //上昇時の当たり判定制御
                const block_y = this.getNextBlock("top");
                if((entity_fall_y + this.bodySize.y >  block_y && block_y !== -1) && !this.isHitInWorldObject("right") && !this.isHitInWorldObject("left")){
                    //プレイヤーの座標をブロックの座標+1に設定し、初速を0
                    this.entityGravityEvent(new EntityGravityEvent(this.getPosition.x, block_y - this.bodySize.y, state, this.gravityProperties.fallStartTime)); //イベントの呼び出し
                    this.setPosition(this.getPosition.x, block_y - this.bodySize.y);
                    this.gravityProperties.initialSpeed = 0;
                    return;
                }
            }
            this.entityGravityEvent(new EntityGravityEvent(this.getPosition.x, y, state, this.gravityProperties.fallStartTime)); //イベントの呼び出し
            this.addPosition(0, y);
        }
    }

    jump(initialSpeed){
        this.gravityProperties.initialSpeed = initialSpeed;

        this.gravityProperties.fallStart = true;
        this.gravityProperties.fallStartTime = new Date();  //落下開始時刻を代入
    }

    /**
     * エンティティをキルします。
     **/
    kill(){
        const e = new EntityDeathEvent();
        this.entityDeathEvent(e);
        if(e.getCanceled) return;
        const scene = this.world.getScene();
        scene.removeTickLoop(this.loopFunction);
        scene.remove(this.entity);
        const i = 0;
        for (let entitiesKey of this.world.entities) {
            if(entitiesKey.UUID === this.UUID){
                this.world.entities.splice(i, 1);
                break;
            }
        }
    }

    //イベントハンドラ
    /**@param e{EntityIsOnGroundEvent}**/
    entityIsOnGroundEvent(e){}
    /**@param e {EntityContactEvent}**/
    entityContactEvent(e){}
    /**@param e {EntityDeathEvent}**/
    entityDeathEvent(e){}
    /**@param e {EntityGravityEvent}**/
    entityGravityEvent(e){}

}

export {Entity};