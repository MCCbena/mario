import * as THREE from "three";

class Block{
    #properties = {};

    #id;
    #hitbox;
    mesh = null;

    /**
     * @param scale {Number}
     * @param id {Number}
     * @param hitbox {boolean}
     */
    constructor(scale, id, hitbox=true) {
        this.#id=id;
        this.#hitbox=hitbox;
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