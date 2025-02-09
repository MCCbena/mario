import {WorldObject} from "../world-object.js";
import {Scene} from "../scene.js";
import {Camera} from "../camera.js";
import {renderer} from "../index.js";
import {Player} from "../entity/Player.js";
import {TextEntity} from "../entity/TextEntity.js";

function callDeathUI(render, scale, width, height){
    const worldObject = new WorldObject(width, height, scale);
    const scene = new Scene();
    const camera = new Camera(width, height, scale);
    const text = new TextEntity(scale, "");
    new TextEntity(scale, "").then(text=>{
        camera.setPosition(width/scale/2, height/scale/2);
        worldObject.displayWorld(scene);
        const player = new Player(scale, {"noAI":true});
        player.setPosition(camera.getPosition.x-1, camera.getPosition.y);
        worldObject.spawnEntity(player);
        text.setPosition(camera.getPosition.x, camera.getPosition.y);
        text.castShadow = true
        console.log(camera.rawCamera.position);
        worldObject.spawnEntity(text);
        worldObject.scene.render(renderer, camera);
    });

}

export {callDeathUI}