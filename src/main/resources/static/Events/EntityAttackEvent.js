import {EventBase} from "./EventBase.js";

class EntityAttackEvent extends EventBase{
    #damager

    /**
     * @param damager {Entity}
    **/
    constructor(damager) {
        super();
        this.#damager = damager;
    }
}

export {EntityAttackEvent};