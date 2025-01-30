import {EventBase} from "./EventBase.js";

class EntityContactEvent extends EventBase{
    /**@type Entity**/
    #entity;

    constructor(touched_entity) {
        super();
        this.#entity = touched_entity;
    }

    get getTouchedEntity(){
        return this.#entity;
    }
}

export {EntityContactEvent}