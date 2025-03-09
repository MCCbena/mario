import * as THREE from "three";
import {EntityContactEvent} from "../Events/EntityContactEvent.js";
import {EntityIsOnGroundEvent} from "../Events/EntityIsOnGroundEvent.js";
import {EntityDeathEvent} from "../Events/EntityDeathEvent.js";
import {EntityGravityEvent} from "../Events/EntityGravityEvent.js";
import {EntityLandingEvent} from "../Events/EntityLandingEvent.js";
import {EntityInstanceLoopEvent} from "../Events/EntityInstanceLoopEvent.js";
import {uuid} from "../micro-util.js";
import {EntityInstanceLoopAfterEvent} from "../Events/EntityInstanceLoopAfterEvent.js";

/* #NBTでサポートされている値

toggleCamera:   bool    カメラをトグルするかを選択します。（1ワールドにつき1エンティティまで）
noAI:           bool    loopFunctionを実行しません。
 */
class Entity {
    //ワールドにスポーンするまではnullです。
    world;

    sizeX = 0;
    sizeY = 0;
    scale = 0;
    #UUID;
    m;//質量

    nbt;

    //重力に関する様々な情報を保存します。
    gravityProperties = {
        "g": 0,
        "fallStartTime": null,
        "fallStart": false,
        "initialY": 0,
        "y_bak": 0,
        "initialSpeed": 0,
        "inertialForce": 0,
        /**fall, flying or nothing("")**/
        "state": "",
    };

    status = {
        "isOnGround": true,
    }

    loopMethods = [];
    removeMethod = [];


    loopFunction = function (){
        if(this.getNBTsafe("noAI", false)) {
            this.entityInstanceLoopAfterEvent(new EntityInstanceLoopAfterEvent());
            return;
        }

        const e = new EntityInstanceLoopEvent();
        this.entityInstanceLoopEvent(e);
        if(!e.getCanceled) {
            this.loopMethods.forEach(temp => {
                if (temp.arg === null) {
                    temp.method();
                } else {
                    temp.method(temp.arg);
                }
            });
        }

        this.removeMethod.forEach(method =>{
            let index = 0
            for (let loopMethod of this.loopMethods) {
                if(loopMethod.method === method){
                    this.loopMethods.splice(index, 1);
                    break;
                }
                index++;
            }
        });
        this.removeMethod = [];

        this.entityInstanceLoopAfterEvent(new EntityInstanceLoopAfterEvent());
    }.bind(this);

    /**
     * すべての引数はnullableです。ただし、引数をnullにした場合は必ず代替処理を実施する必要があります。
     * @param body_size {[width, height]}
     * @param scale {Number}
     * @param m {Number}
     * @param material
     * @param nbt {{}}
     */
    constructor(body_size, scale, m, material, nbt={}) {
        this.#UUID = uuid();

        if(body_size !== null && scale !== null) {
            this.sizeX = body_size[0] * scale;
            this.sizeY = body_size[1] * scale;

            if(material != null) {
                const entityGeo = new THREE.BoxGeometry(this.sizeX, this.sizeY, 0);
                this.entity = new THREE.Mesh(entityGeo, material);
            }
        }
        if(scale !== null) this.scale = scale;
        if(m !== null) this.m = m;
        if(nbt !== null) this.nbt = nbt;

        //ワールドの範囲外に進出した瞬間にkill
        this.addTickLoop(function (){
            const position = this.getPosition;
            if(position.x < -this.bodySize.x || position.y <= 0.1 ||
            position.x > this.world.getWidth+1){
                this.kill();
            }
        }.bind(this));

        //イベントハンドラ
        this.addTickLoop(this.applyGravity.bind(this));
        this.addTickLoop(function () {
            this.status.isOnGround = this.isHitInWorldObject("bottom");
            if(this.status.isOnGround) this.entityIsOnGroundEvent(new EntityIsOnGroundEvent());
        }.bind(this));//エンティティが地面に接触しているとき
        this.addTickLoop(function () { //エンティティと接触した時
            this.#callContactEvent(this.getPosition.x, this.getPosition.y);
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

    /**
     * エンティティの座標を返します。
     * @returns {{x: number, y: number}}
     */
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
     * エンティティのティックループにメソッドを追加します。すでに追加済みのメソッドは追加されません。
     * @param method {method}
     * @param arg
     */
    addTickLoop(method, arg=null){
        for (let loopMethod of this.loopMethods) {
            if(loopMethod.method===method){
                return;
            }
        }
        this.loopMethods.push({
            "method": method,
            "arg": arg
        });
    }

    /**
     * エンティティのティックループに追加されているメソッドを削除します。注意として、sceneのティックループのように削除はすぐに実行されるわけではありません。
     */
    removeTickLoop(method){
        this.removeMethod.push(method);
    }

    /**
     * 指定した向きにあるブロックの中で一番エンティティに近いものの座標を返します。
     *
     * top/bottomはy座標, right/leftはx座標を返します。
     * @param direction {string} {top/bottom/right/left}
     * @return {number}
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
                                if(blocks[y].hitbox && min_or_max < y){
                                    min_or_max = y;
                                }
                            }
                            break;
                        case "top":
                            for (let y = parseInt(top_full+height_offset); y < blocks.length; y++) {
                                if(blocks[y].hitbox && min_or_max > y){
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
                                if(blocks[x].hitbox && min_or_max > x) {
                                    min_or_max = x;
                                }
                            }
                            break;
                        case "left":
                            for (let x = parseInt(left_full-weight_offset); x >= 0; x--) {
                                if(blocks[x].hitbox && min_or_max < x) {
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
            if(topElement === null) continue;
            if(topElement.hitbox) {
                return true;
            }
        }
        return false;
    }

    /**
     * NBTから値を取り出すとき、undefinedが返されるのを抑制します。
     * @param key {String}
     * @param alternativeValues undefinedを出したときに代わりに出力する値
     */
    getNBTsafe(key, alternativeValues){
        if(this.nbt[key] === undefined) return alternativeValues;
        else return this.nbt[key];
    }


    applyGravity(){
        const call_contact_event = function (start_x, start_y, end_x, end_y){
            for (let x = start_x; x <= end_x; x+=0.1) {
                for (let y = start_y; y < end_y; y+=0.1) {
                    if(this.#callContactEvent(x, y)) return;
                }
            }
        }.bind(this);
        //エンティティが落下を開始した時に動作
        if(!this.status.isOnGround && !this.gravityProperties.fallStart) {
            this.gravityProperties.fallStart = true;
            this.gravityProperties.fallStartTime = new Date();  //落下開始時刻を代入
            this.gravityProperties.initialY = this.getPosition.y;
            this.gravityProperties.y_bak = 0;
            console.log("fall start");
        }

        //空中にいるとき
        if(this.gravityProperties.fallStart) {
            const g = this.gravityProperties.g*4; //重力加速度を取得
            const t = (new Date().getTime() - this.gravityProperties.fallStartTime.getTime())/1000; //経過時間を秒で取得

            const v0 = this.gravityProperties.initialSpeed;
            const y = (v0 * t) - (0.5 * g * t*t); //自由落下の公式により計算
            const fall_state = this.gravityProperties.y_bak - y > 0;
            this.gravityProperties.y_bak = y;
            const entity_fall_y = this.gravityProperties.initialY+y //エンティティの座標が何ブロック下になるかを計算

            let state= "flying";
            if (fall_state) state = "fall";
            this.gravityProperties.state = state;
            //エンティティが上昇しているか降下しているかを判定
            if (fall_state) {
                //落下の当たり判定制御
                const block_y = this.getNextBlock("bottom");
                if(entity_fall_y <= block_y+1){
                    //イベントハンドラーを呼び出し
                    this.entityLandingEvent(new EntityLandingEvent(this.getPosition.x, block_y+1.01, "falling", this.gravityProperties.fallStartTime));
                    call_contact_event(this.getPosition.x, block_y+1.01, this.getPosition.x, this.getPosition.y);
                    //エンティティの座標をブロックの座標+1に設定し、自由落下を解除
                    this.setPosition(this.getPosition.x, block_y+1.01);
                    this.gravityProperties.fallStart = false;
                    this.gravityProperties.initialSpeed = 0;
                    this.gravityProperties.initialY = 0;
                    return;
                }else call_contact_event(this.getPosition.x, entity_fall_y, this.getPosition.x, this.getPosition.y);

            } else {
                //上昇時の当たり判定制御
                const block_y = this.getNextBlock("top");
                if((entity_fall_y + this.bodySize.y >  block_y && block_y !== -1) ){
                    //イベントハンドラーを呼び出し
                    call_contact_event(this.getPosition.x, this.getPosition.y, this.getPosition.x, block_y - this.bodySize.y);
                    //エンティティの座標をブロックの座標+1に設定し、初速を0
                    this.setPosition(this.getPosition.x, block_y - this.bodySize.y);
                    this.gravityProperties.initialSpeed = 0;
                    this.gravityProperties.fallStartTime = new Date();
                    this.gravityProperties.initialY = block_y - this.bodySize.y;
                    return;
                }else call_contact_event(this.getPosition.x, this.getPosition.y, this.getPosition.x, y);
            }
            const e = new EntityGravityEvent(this.getPosition.x, this.getPosition.y+y, state, this.gravityProperties.fallStartTime);
            this.entityGravityEvent(e); //イベントの呼び出し
            if(e.getCanceled) return;
            this.setPosition(this.getPosition.x, this.gravityProperties.initialY+y);
        }
    }

    jump(initialSpeed){
        this.gravityProperties.initialSpeed = initialSpeed;

        this.gravityProperties.fallStart = true;
        this.gravityProperties.fallStartTime = new Date();  //落下開始時刻を代入
        this.gravityProperties.initialY = this.getPosition.y;
    }

    /**
     * エンティティをキルします。
     **/
    kill(){
        const e = new EntityDeathEvent();
        this.entityDeathEvent(e);
        if(e.getCanceled) return;
        
        const scene = this.world.scene;
        scene.removeTickLoop(this.loopFunction);
        scene.remove(this.entity);
        let i = 0;
        this.entity.material.dispose();
        this.entity.geometry.dispose();
        for (let entitiesKey of this.world.entities) {
            if(entitiesKey.UUID === this.UUID){
                this.world.entities.splice(i, 1);
                break;
            }
            i++;
        }
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

    //イベントハンドラ
    /**
     * エンティティが地面に設置している間呼ばれます。
     * @param e{EntityIsOnGroundEvent}
     **/
    entityIsOnGroundEvent(e){}
    /**
     * 別のエンティティに接触した場合呼ばれます。
     * @param e {EntityContactEvent}
     **/
    entityContactEvent(e){}
    /**
     * エンティティが死亡した場合に呼ばれます。
     * @param e {EntityDeathEvent}
     **/
    entityDeathEvent(e){}
    /**
     * エンティティが重力の影響を受けている間呼ばれます。
     * @param e {EntityGravityEvent}
     **/
    entityGravityEvent(e){}
    /**
     * エンティティが地面に着地する瞬間に呼ばれます。
     * @param e {EntityLandingEvent}
     **/
    entityLandingEvent(e){}
    /**
     * エンティティのメインループであるLoopFunctionが呼び出されたときに呼び出されます。
     * EventBaseのcancelメソッドを用いてLoopFunction自体を停止することも可能です。
     * @param e {EntityInstanceLoopEvent}
     */
    entityInstanceLoopEvent(e){}

    /**
     * LoopFunctionの終了際に呼び出されます。entityInstanceLoopEventでloopEventがキャンセルされた場合でも呼び出されます。
     * @param e {EntityInstanceLoopAfterEvent}
     */
    entityInstanceLoopAfterEvent(e){}
    /**
     * エンティティがスポーンした時に呼ばれます。
     * @param e {EntitySpawnEvent}
     */
    entitySpawnEvent(e){}

}

export {Entity};