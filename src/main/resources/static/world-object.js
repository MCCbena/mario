import {Material} from "./block/Material.js";
import {Actor} from "./entity/Actor.js";
import {EntitySpawnEvent} from "./Events/EntitySpawnEvent.js";

class WorldObject {
    entities = [];
    #scale;
    #scene = null;
    #name

    constructor(width=0, height=0, scale, name) {
        /** @type {Number} */this.height = height;
        /** @type {Number} */this.width = width;
        /** @type {Block[Block]} */const worlds = [];
        /**@type {Number} */this.#scale = scale;

        //画面サイズ分AIRオブジェクトを生成して代入
        for(let y = 0; y < height; y++) {
            worlds.push([]);
            for(let x = 0; x < width; x++) {
                const world_object = new Material.AIR.properties.class(scale);
                worlds[y].push(world_object);
            }
        }
        this.worlds = worlds;
        this.#name = name;
    }

    get getHeight() {
        return this.height;
    }

    get getWidth() {
        return this.width;
    }

    /**
    x, yがnullな場合、すべてのブロックオブジェクトを返す
    xがnullな場合、指定されたy軸すべてのブロックオブジェクトを返す
    yがnull名場合、指定されたx軸すべてのブロックオブジェクトを返す
     */
    getBlockObject(x, y){
        try {
            if (x == null && y == null)
                /** @returns BlockObject[BlockObject[]] */
                return this.worlds;
            if (x == null) return this.worlds[y];
            if (y == null) {
                const worlds = []
                for (let y = 0; y < this.height; y++) {
                    worlds.push(this.worlds[y][x]);
                }
                return worlds;
            }
            return this.worlds[y][x];
        }catch (e) {
            return null;
        }
    }

    setBlockObject(
        /** @type Block */ object,
        /** @type Number */ x,
        /** @type Number */ y
    ){
        if(this.worlds[y][x] !== null && this.#scene !== null){
            this.#scene.remove(this.worlds[y][x].mesh);
        }
        this.worlds[y][x] = object;

        if(object.mesh !== null){
            object.mesh.position.set(parseInt(x*this.#scale), parseInt(y*this.#scale), 0);
            if(this.#scene !== null) this.#scene.add(object.mesh);
        }
    }

    removeBlockObject(
        /** @type Number */ x,
        /** @type Number */ y
    ){
        this.setBlockObject(new Material.AIR.properties.class(this.#scale), x, y);
    }


    /**
     * @param scene {Scene}
     */
    displayWorld(scene){
        this.#scene = scene;
        for(let x = 0; x < this.width; x++){
            for(let y = 0; y < this.height; y++){
                if(this.getBlockObject(x, y).mesh != null) scene.add(this.getBlockObject(x, y).mesh);
            }
        }

        this.entities.forEach(entity=>{
            scene.add(entity.entity);
            scene.addTickLoop(entity.loopFunction);
        });
    }

    /**
     * @param entity {Entity}
     * @param x {Number}
     * @param y {Number}
     */
    spawnEntity(entity, x, y){
        const event = new EntitySpawnEvent(x, y, this);
        entity.entitySpawnEvent(event);
        if(event.getCanceled) return;

        entity.setPosition(event.spawnX, event.spawnY);
        entity.world = this;
        if(this.scene !== null) {
            this.scene.add(entity.entity);
            this.scene.addTickLoop(entity.loopFunction);
        }

        this.entities.push(entity);
    }

    /**
     * 指定したx,y座標を中心にrangeの範囲にいるエンティティをユークリッド距離で計算し返します。
     * @param x {Number}
     * @param y {Number}
     * @param range {Number}
     **/
    getEntityInRange(x, y, range){
        const entities = []; 

        for (let entity of this.entities) {
            const entity_loc = entity.getPosition;
            const x1 = x-entity_loc.x;
            const y1 = x-entity_loc.y;
            const distance = Math.sqrt(x1*x1+y1*y1);
            if(distance <= range){
                entities.push(entity);
            }
        }
        return entities;
    }

    /**
     * worldObjectのベースとなっているシーンを返します。displayWorldメソッドが呼び出されていない場合、nullを返します。
     * @returns {Scene}
     */
    get scene(){
        return this.#scene;
    }

    /**
     * ワールドの名前を取得します。
     * @returns {String}
     */
    get name(){
        return this.#name;
    }
}

function getWorld(number, scale) {
    let socket;
    socket = new SockJS("/stage/socket");
    //接続確立
    socket.onopen = function () {
        console.log("接続確立");
        socket.send(JSON.stringify({
            "number": number,
            "type": "GET"
        }));
    }

    return new Promise((resolve) => {
        socket.onmessage = function (event) {
            const jsonData = JSON.parse(event.data);
            console.log(event.data);
            const worldObject = new WorldObject(jsonData.world_info.width, jsonData.world_info.height, scale, number);
            //ブロック構築用のループ
            jsonData.stage.forEach(stage=>{
                if (stage.type !== 0) {
                    // オブジェクトを作成
                    worldObject.setBlockObject(new (Material.getMaterial(stage.type).properties.class)(scale, stage.nbt), stage.x, stage.y);
                }
            });

            //エンティティ用のループ
            jsonData.entities.forEach(entity=>{
                const instanceEntity = new (Actor.getActor(entity.type).properties.class)(scale, entity.nbt);
                worldObject.spawnEntity(instanceEntity, entity.x, entity.y);
            });
            socket.close();

            return resolve(worldObject);
        }
    });
}

function getEntity(number, scale){
    let socket;
    socket = new SockJS("/stage/socket");
    //接続確立
    socket.onopen = function () {
        console.log("接続確立");
        socket.send(JSON.stringify({
            "number": number,
            "type": "GET"
        }));
    }

    return new Promise(resolve => {
        socket.onmessage = function (event) {
            const jsonData = JSON.parse(event.data);

            const entities = [];
            //エンティティ用のループ
            jsonData.entities.forEach(entity=>{
                if(entity.type !== 0) {
                    const instanceEntity = new (Actor.getActor(entity.type).properties.class)(scale, entity.nbt);
                    entities.push({
                        "instance":instanceEntity,
                        "spawn": [entity.x, entity.y]
                    });
                }
            });

            socket.close();
            return resolve(entities);
        }
    });
}

export {getWorld, getEntity, WorldObject};