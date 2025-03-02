import {Block} from "./Block.js";

class Invisible extends Block{
    displayMesh;

    constructor(scale, nbt = {}) {
        super(scale, 1, false, nbt);
        const material = this.generateDefaultMaterial("images/hardBlock.png");
        this.displayMesh = this.generateMesh(this.scale, material);
        this.mesh = null;
    }

    /**
     * ブロックが隠れている場合、表示します。
     */
    display(){
        if(this.mesh == null && this.world != null){
            this.mesh = this.displayMesh;

            this.hitbox = true;
            this.world.setBlockObject(this, this.x, this.y); //ブロックを再設置することによってブロックのステータスをアップデート
        }
    }

    /**
     * ブロックを隠します。
     */
    invisible(){
        if(this.mesh != null && this.world != null){
            this.mesh = this.displayMesh;
            this.hitbox = false;
            this.world.setBlockObject(this, this.x, this.y);
        }
    }
}

export {Invisible};