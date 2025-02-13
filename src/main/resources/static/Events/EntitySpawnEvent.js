import {EventBase} from "./EventBase.js";

class EntitySpawnEvent extends EventBase{
    spawnX;
    spawnY;
    #world;
    constructor(x, y, world) {
        super();
        this.spawnX = x;
        this.spawnY = y;
        this.#world = world;
    }

    /**
     * スポーンするワールドを返します。
     * @returns {WorldObject}
     */
    get world() {
        return this.#world;
    }
}

export {EntitySpawnEvent};