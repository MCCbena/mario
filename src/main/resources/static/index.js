import * as THREE from "three";
import {downKey, upKey} from "./micro-util.js"
import {getWorld} from "./world-object.js";
import {Camera} from "./camera.js";
import {Scene} from "./scene.js";

const scale = 50.0;
const width = 640;
const height = 480;
let deathCount = 4;//残機
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("glcanvas")
});

function init() {
    const scene = new Scene(0xA0B4FA);
    const camera = new Camera(width, height, scale);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    camera.setPosition(width/scale/2, height/scale/2);
    //camera.setPosition(0, -2);

    // ワールドを設定
    let world;
    getWorld("1-1", scale, scene).then(result=>{
        world = result[0];

        world.displayWorld(scene);
        for (let entitiesKey of world.entities) {
            if(entitiesKey.getNBTsafe("toggleCamera", false)){
                camera.toggleEntity([entitiesKey.nbt.toggleCameraStart, entitiesKey.nbt.toggleCameraStop], entitiesKey);
                break;
            }
        }

        world.scene.render(renderer, camera);
    });
}

//残機を1マイナス
function minusLife(){
    deathCount--;
}

function setLife(){
    deathCount = 4;
}


document.onkeydown = downKey;
document.onkeyup = upKey;
init();

export {renderer, init, deathCount, minusLife, setLife};