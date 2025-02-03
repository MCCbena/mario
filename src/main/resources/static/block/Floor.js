import {Block} from "./Block.js";

class Floor extends Block{

    constructor(scale) {
        super(scale, 1, true);
        const material = this.generateDefaultMaterial("images/dotblock.png");
        this.mesh = this.generateMesh(scale, material);
    }
}

export {Floor}