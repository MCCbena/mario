import * as THREE from "three";
import {downKey, upKey} from "./micro-util.js"
import {getWorld} from "./world-object.js";
import {Camera} from "./camera.js";
import {Scene} from "./scene.js";

const scale = 50.0;
const width = 640;
const height = 480;
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("glcanvas")
});
const scene = new Scene();
const camera = new Camera(width, height, scale);

function init() {

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    camera.setPosition(width/scale/2, height/scale/2);
    //camera.setPosition(0, -2);

    // ワールドを設定
    let world;
    getWorld("1-1", scale, scene).then(result=>{
        world = result;

        world.displayWorld(scene);
        for (let entitiesKey of world.entities) {
            if(entitiesKey.getNBTsafe("toggleCamera", false)){
                camera.toggleEntity([0, 20], entitiesKey);
                break;
            }
        }

        world.scene.addTickLoop(camera.updateStatus.bind(camera));
        world.scene.render(renderer, camera);
    });
}


document.onkeydown = downKey;
document.onkeyup = upKey;
init();