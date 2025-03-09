import {StandardEnemy} from "./StandardEnemy.js";
import {Player} from "./Player.js";
import {isDown} from "../micro-util.js";

class JumpTraceEnemy extends StandardEnemy{
    constructor(scale, nbt = {}) {
        super(scale, nbt);
        this.addTickLoop(function () {
            if(isDown("w")) {
                if(!this.gravityProperties.fallStart){
                    this.jump(20);
                }
            }
        }.bind(this));
    }

    //プレイヤーが敵に触れたら殺す
    entityContactEvent(e) {
        if(e.getTouchedEntity instanceof Player) {
            const player = e.getTouchedEntity;
            player.kill();
        }
    }
}

export {JumpTraceEnemy};