import {WorldObject} from "../worldUtil/world-object.js";
import {Scene} from "../scene.js";
import {Camera} from "../camera.js";
import {deathCount, renderer} from "../index.js";
import {Player} from "../entity/Player.js";
import {TextEntity} from "../entity/TextEntity.js";

function callLifeUI(render, scale, width, height){
    const worldObject = new WorldObject(width, height, scale, "lifeUI");
    const scene = new Scene();
    const camera = new Camera(width, height, scale);
    worldObject.displayWorld(scene);
    worldObject.scene.render(renderer, camera);
    new TextEntity(scale, `x${deathCount}`, "M PLUS 1 Code_Regular.json", camera, {size:20}).then(text=>{
        camera.setPosition(width/scale/2, height/scale/2);
        const player = new Player(scale, {"noAI":true});
        worldObject.spawnEntity(player, camera.getPosition.x-1, camera.getPosition.y);
        //text.entity.position.z = 1000-30;
        worldObject.spawnEntity(text, camera.getPosition.x, camera.getPosition.y);
    });

    return worldObject;
}

export {callLifeUI}