import {Block} from "./Block.js";

class Brick extends Block{
    /**
     * @param scale {Number}
     * @param nbt {{}}
     */
    constructor(scale, nbt = {}) {
        super(scale, 1, true, nbt);
        const material = this.generateDefaultMaterial("images/brick.png");
        this.mesh = this.generateMesh(scale, material);
    }
}

export {Brick};