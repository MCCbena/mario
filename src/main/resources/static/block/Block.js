import * as THREE from "three";

class Block{
    #properties = {};

    #id;
    #hitbox;
    mesh = null;

    #nbt = {};

    /**
     * @param scale {Number}
     * @param id {Number}
     * @param hitbox {boolean}
     * @param nbt {{}}
     */
    constructor(scale, id, hitbox=true, nbt={}) {
        this.#id=id;
        this.#hitbox=hitbox;

        this.#nbt = nbt;
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


    get hitbox(){
        return this.#hitbox;
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

}

export {Block}