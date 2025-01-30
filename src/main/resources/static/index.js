import * as THREE from "three";
import {isDown, downKey, upKey} from "./micro-util.js"
import {BlockObject, Material, getWorld} from "./world-object.js";
import {Player} from "./entity/Player.js";
import {Camera} from "./camera.js";
import {Scene} from "./scene.js";
import {Enemy} from "./entity/Enemy.js";

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

    //プレイヤーを生成
    const player = new Player(scale);
    player.setPosition(1, 4);

    // ワールドを設定
    let world;
    getWorld("1-1", scale).then(result=>{
        world = result;

        world.displayWorld(scene);
        camera.toggleEntity([0, 20], player);
        //player.displayEntity(world);
        world.spawnEntity(player);

        const enemy = new Enemy(scale);
        world.spawnEntity(enemy);
        enemy.setPosition(1, 10);
        const enemy2 = new Enemy(scale);
        world.spawnEntity(enemy2);
        enemy2.setPosition(5, 10);

        world.getScene().addTickLoop(camera.updateStatus.bind(camera));
        world.getScene().render(renderer, camera.camera);
    });
}


document.onkeydown = downKey;
document.onkeyup = upKey;
init();