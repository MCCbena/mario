class Property{
    #id;
    #instance;

    /**
     * @param id {Number}
     * @param instance {Block}
     */
    constructor(id, instance) {
        this.#id = id;
        this.#instance = instance;
    }

    get properties(){
        return Object.freeze({
            "id": this.#id,
            "class": this.#instance,
        });
    }
}

export {Property}