import {Entity} from "./Entity.js";
import {Player} from "./Player.js";
import {init, renderer, setLife} from "../index.js";
import {callLifeUI} from "../specialScenes/displayLifeUI.js";
import * as THREE from "three";

/* #NBTでサポートされている値
nextWorld:           String    次のワールドの名前を代入します。
 */
class GoalPoint extends Entity {
    nextWorld = "";

    constructor(scale, nbt) {
        const material = new THREE.MeshBasicMaterial({color:0x198713})
        super([0.6, 4], scale, 1, material, nbt);
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
                    init(this.nextWorld);
                }
            }.bind(this));
        }
    }

    entitySpawnEvent(e) {
        this.nextWorld = this.getNBTsafe("nextWorld", e.world.name);
    }
}

export {GoalPoint};