class EventBase {
    #canceled = false;

    /**
     * キャンセル可能なイベントの場合、そのイベントをなかったことにします。
     * @param status {boolean}
    **/
    set setCanceled(status){
        this.#canceled = status;
    }

    get getCanceled(){
        return this.#canceled;
    }
}

export {EventBase}