import {Block} from "./Block.js";

class Floor extends Block{

    /**
     * @param scale {Number}
     * @param nbt {{}}
     */
    constructor(scale, nbt = {}) {
        super(scale, 1, true, nbt);
        const material = this.generateDefaultMaterial("images/dotblock.png");
        this.mesh = this.generateMesh(scale, material);
    }
}

export {Floor}