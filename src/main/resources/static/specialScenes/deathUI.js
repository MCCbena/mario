import {WorldObject} from "../world-object.js";
import {Scene} from "../scene.js";
import {Camera} from "../camera.js";
import {deathCount, renderer} from "../index.js";
import {Player} from "../entity/Player.js";
import {TextEntity} from "../entity/TextEntity.js";

function callDeathUI(render, scale, width, height){
    const worldObject = new WorldObject(width, height, scale);
    const scene = new Scene();
    const camera = new Camera(width, height, scale);
    new TextEntity(scale, `x${deathCount}`, "M PLUS 1 Code_Regular.json", camera, {size:20}).then(text=>{
        camera.setPosition(width/scale/2, height/scale/2);
        worldObject.displayWorld(scene);
        const player = new Player(scale, {"noAI":true});
        player.setPosition(camera.getPosition.x-1, camera.getPosition.y);
        worldObject.spawnEntity(player);
        text.addPosition(camera.getPosition.x, camera.getPosition.y);
        //text.entity.position.z = 1000-30;
        worldObject.spawnEntity(text);
        worldObject.scene.render(renderer, camera);
    });

    return worldObject;
}

export {callDeathUI}