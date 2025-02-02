import * as THREE from "three";


class Property{
    #id;
    #hitbox;
    #texturePath = null;
    #material = null;

    constructor(id,  texturePath=null, hitbox=true) {
        this.#id=id;
        this.#hitbox=hitbox;

        if(texturePath!==null) {
            const loader = new THREE.TextureLoader();
            const texture = loader.load(texturePath);
            texture.colorSpace = THREE.SRGBColorSpace;
            this.#material = new THREE.MeshBasicMaterial({map: texture});
            this.#texturePath = texturePath;
        }
    }

    get properties(){
        return Object.freeze({
            "hitbox": this.#hitbox,
            "id": this.#id,
            "material": this.#material,
            "texturePath": this.#texturePath
        });
    }
}
/*
typeリスト
AIR:空気オブジェクト
FLOOR:床ブロック
 */
const Material = Object.freeze({
    AIR: new Property(0, null,false),
    FLOOR: new Property(1, "images/dotblock.png", true),

    //Material振られたIDからキーを取得
    getMaterial(id){
        for (let materialKey in Material) {
            if(id===Material[materialKey].properties.id){
                return Material[materialKey];
            }
        }
    }
})



class BlockObject {
    /**
     *  @type {Number} scale
     *  @type {Property} type
     */
    constructor(scale, type) {
        
        if (type.properties.material !== null) {
            const geometry = new THREE.BoxGeometry(parseInt(scale), parseInt(scale), 0);
            /** @type {THREE.Mesh} */ this.object = new THREE.Mesh(geometry, type.properties.material);
        }else this.object = null;
        
        /** @type {Property} */    this.type = type;
    }

    /**
     * @returns {THREE.Mesh}
     */
    get getObject(){
        return this.object
    }

    get getType(){
        return this.type;
    }
}

class WorldObject {
    entities = [];
    #scale;
    #scene = null;

    constructor(width=0, height=0, scale) {
        /** @type {Number} */this.height = height;
        /** @type {Number} */this.width = width;
        /** @type {BlockObject[BlockObject]} */const worlds = [];
        /**@type {Number} */this.#scale = scale;

        //画面サイズ分AIRオブジェクトを生成して代入
        for(let y = 0; y < height; y++) {
            worlds.push([]);
            for(let x = 0; x < width; x++) {
                const world_object = new BlockObject(null, Material.AIR);
                worlds[y].push(world_object);
            }
        }
        this.worlds = worlds;
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
        /** @type BlockObject */ object,
        /** @type Number */ x,
        /** @type Number */ y
    ){
        this.worlds[y][x] = object;
        if(object.getObject !== null){
            object.getObject.position.set(parseInt(x*this.#scale), parseInt(y*this.#scale), 0);
        }
    }

    removeBlockObject(
        /** @type Number */ x,
        /** @type Number */ y
    ){
        const object = new BlockObject(null, Material.AIR);
        this.setBlockObject(object, x, y);
    }


    /**
     * @param scene {Scene}
     */
    displayWorld(scene){
        this.#scene = scene;
        for(let x = 0; x < this.width; x++){
            for(let y = 0; y < this.height; y++){
                if(this.getBlockObject(x, y).getObject != null) scene.add(this.getBlockObject(x, y).getObject);
            }
        }
    }

    /**
     * @param entity {Entity}
     */
    spawnEntity(entity){
        entity.world = this;
        this.scene.add(entity.entity);
        this.scene.addTickLoop(entity.loopFunction);

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
}

function getWorld(number, scale) {
    let socket;
    socket = new SockJS("/stage/socket");
    //接続確立
    socket.onopen = function (event) {
        console.log("接続確立");
        socket.send(JSON.stringify({
            "number": number,
            "type": "GET"
        }));
    }

    return new Promise((resolve) => {
        socket.onmessage = function (event) {
            const jsonData = JSON.parse(event.data);
            const worldObject = new WorldObject(jsonData.world_info.width, jsonData.world_info.height, scale);
            for (let i = 0; i < jsonData.stage.length; i++) {
                const stage = jsonData.stage[i];
                if (stage.type !== 0) {
                    // オブジェクトを作成
                    worldObject.setBlockObject(new BlockObject(scale, Material.getMaterial(stage.type)), stage.x, stage.y);
                }
            }
            return resolve(worldObject);
        }
    })
}

export {BlockObject, Material, getWorld, WorldObject};