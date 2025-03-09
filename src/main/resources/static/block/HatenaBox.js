import {Block} from "./Block.js";
import {HardBlock} from "./HardBlock.js";
import {Actor} from "../entity/Actor.js";

/* #NBTでサポートされている値
entityID     int     スポーンするエンティティを選択します。
entityNBT       String  スポーンするエンティティのNBTをJSON形式で渡せます。
 */
class HatenaBox extends Block{
    constructor(scale, nbt = {}) {

        super(scale, 1, true, nbt);
        const material = this.generateDefaultMaterial("images/hatenaBOX.jpg");
        this.mesh = this.generateMesh(scale, material);
    }

    touch(){
        if(this.world != null) {
            const nbt = JSON.parse(this.getNBTsafe("entityNBT", "{}"));
            nbt.noAI = true;
            const entity = new (Actor.getActor(this.getNBTsafe("entityID", Actor.StandardEnemy.properties.id)).properties.class)(this.scale, nbt);
            this.tickloop = this.#entitySpawnAnimation.bind(this);
            this.world.scene.addTickLoop(this.tickloop);
            this.entity = entity;
            this.world.spawnEntity(entity, this.x, this.y);
            this.world.setBlockObject(new HardBlock(this.scale, {}), this.x, this.y);
        }
    }

    #entitySpawnAnimation(){
        if(this.start === undefined) this.start = new Date().getTime();
        const elapsedTime = (new Date().getTime()-this.start)/1000;
        console.log(elapsedTime);
        this.entity.setPosition(this.x, elapsedTime*2+this.y);
        if(elapsedTime > 0.5){
            this.entity.nbt.noAI = false;
            this.world.scene.removeTickLoop(this.tickloop);
        }
    }
}

export {HatenaBox};