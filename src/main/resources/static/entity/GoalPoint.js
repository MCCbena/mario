import {Entity} from "./Entity.js";
import {Player} from "./Player.js";
import {init, renderer, setLife} from "../index.js";
import {callLifeUI} from "../specialScenes/displayLifeUI.js";

class GoalPoint extends Entity {
    constructor(scale, nbt) {
        super([0.6, 4], scale, 1, nbt);
    }

    entityContactEvent(e) {
        if(e.getTouchedEntity instanceof Player){
            const start = new Date().getTime();
            while (new Date().getTime() - start < 2000) {}
            setLife();
            this.world.scene.stopRender();
            const ui = callLifeUI(renderer, this.scale, this.world.scene.camera.getWidth, this.world.scene.camera.getHeight);
            ui.scene.addTickLoop(function (){
                if(new Date().getTime() - start > 4000) {
                    ui.scene.stopRender();
                    init();
                }
            }.bind(this));
        }
    }
}

export {GoalPoint};