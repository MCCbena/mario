import {Entity} from "./Entity.js";
import {isDown} from "../micro-util.js";
import {deathCount, init, minusLife, renderer} from "../index.js";
import {callDeathUI} from "../specialScenes/deathUI.js";

class Player extends Entity {

    constructor(scale, nbt={}) {
        super([0.6, 1], scale, 10, nbt);
        this.gravityProperties.g = 9.8

        this.addTickLoop(this.key_move.bind(this));
    }

    addPosition(x, y) {
        if(this.world.scene !== null){
            if(this.world.scene.camera !== null){
                const position = this.world.scene.camera.onCameraPosition(this.getPosition.x+x, this.getPosition.y+y);
                x = position[0]-this.getPosition.x;
                y = position[1]-this.getPosition.y;
            }
        }
        super.addPosition(x, y);
    }

    key_move(){
        if(isDown("d")){
            if(!this.isHitInWorldObject("right")) {
                this.addPosition(0.1, 0);
            }
        }
        if(isDown("a")){
            if(!this.isHitInWorldObject("left")) {
                this.addPosition(-0.1, 0);
            }
        }
        if(isDown("w")){
            if(!this.gravityProperties.fallStart){
                this.jump(4);
            }
        }
        if(isDown("k")&&this.killed === undefined){
            this.killed = true;
            this.kill();
        }
    }

    entityContactEvent(e) {
        if(!this.gravityProperties.fallStart) {
            this.kill();
        }else {
            const entity = e.getTouchedEntity;
            this.setPosition(this.getPosition.x, entity.getPosition.y+entity.bodySize.y);
            this.jump(this.gravityProperties.initialSpeed+1.5);
            entity.kill();
        }
    }

    entityDeathEvent(e) {
        console.log("death");
        e.setCanceled = true;
        minusLife();
        this.world.scene.stopRender();
        const camera = this.world.scene.camera;
        camera.setPosition(this.getPosition.x, camera.getPosition.y);
        const world = callDeathUI(renderer, this.scale, camera.getWidth, camera.getHeight);
        this.setPosition(1, 4);
        this.time = new Date().getTime();
        world.scene.addTickLoop(function () {
            if(new Date().getTime()-this.time > 2000){
                world.scene.stopRender();
                world.entities.forEach(temp=>temp.dispose());
                this.world.scene.restartRender();
            }
        }.bind(this))
    }
}

export {Player};