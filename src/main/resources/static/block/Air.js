import {Block} from "./Block.js";

class Air extends Block{
    constructor(scale, nbt) {
        super(scale, 0, false, nbt);
    }
}

export {Air}