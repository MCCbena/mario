import * as THREE from "three";

/* NBTでサポートされている値
temporary   bool    プレイヤーが死んだとき、ブロックを削除します。
 */
class Block{
    #properties = {};

    #id;
    hitbox;
    mesh = null;
    scale;

    //ワールドにセットされた際にnullではなくなります。
    world = null; //セットされているワールド
    x = null; //x座標
    y = null; //y座標

    nbt = {};

    /**
     * @param scale {Number}
     * @param id {Number}
     * @param hitbox {boolean}
     * @param nbt {{}}
     */
    constructor(scale, id, hitbox=true, nbt={}) {
        this.#id=id;
        this.hitbox=hitbox;

        this.nbt = nbt;
        this.scale=scale;
    }

    generateDefaultMaterial(texturePath){
        if(texturePath!==null) {
            const loader = new THREE.TextureLoader();
            const texture = loader.load(texturePath);
            texture.colorSpace = THREE.SRGBColorSpace;
            return new THREE.MeshBasicMaterial({map: texture});
        }else return null;
    }

    generateMesh(scale, material){
        const geometry = new THREE.BoxGeometry(parseInt(scale), parseInt(scale), 0);
        return  new THREE.Mesh(geometry, material);
    }

    get properties(){
        return this.#properties;
    }

    getProperties(key){
        return  this.#properties[key];
    }

    setProperties(key, value){
        this.#properties[key] = value;
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
}

export {Block}