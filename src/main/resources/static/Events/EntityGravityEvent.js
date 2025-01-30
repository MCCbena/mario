import {EventBase} from "./EventBase.js";

//重力が適応されてる（空中にいる時に呼ばれます）。
class EntityGravityEvent extends EventBase{
    #fall_x;
    #fall_y;
    #state;
    #time;

    /**
     * @param fall_x {Number}
     * @param fall_y {Number}
     * @param state {String}
     * @param time {Date}
     */
    constructor(fall_x, fall_y, state, time) {
        super();
        this.#fall_x = fall_x;
        this.#fall_y = fall_y;

        this.#state = state;

        this.#time = time;
    }

    /**
     * 計算のよって移動する次の座標を値を返します。
     * @returns [x, y]
     */
    get getCalculatedPosition(){
        return [this.#fall_x, this.#fall_y];
    }

    /**
     * @returns String {"falling", "flaying}
     */
    get state(){
        return this.#state;
    }

    /**
     * 重力が適応され始めた時の時間を返します。
     * @returns Date
     */
    get getDate(){
        return this.#time;
    }
}

export {EntityGravityEvent};