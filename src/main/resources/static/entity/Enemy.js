import {Entity} from "./Entity.js";
import {Player} from "./Player.js";

class Enemy extends Entity{
    constructor(body_size, scale,m, material, nbt) {
        super(body_size, scale, m, material, nbt);
        this.gravityProperties.g = 9.8;
    }

    //エンティティがカメラの範囲外に出たら動きを停止
    entityInstanceLoopEvent(e) {

        if(this.world.scene.camera !== null) {
            const cameraPos = this.world.scene.camera.onCameraPosition(this.getPosition.x, this.getPosition.y, this.bodySize.x/2, this.bodySize.y/2);
            if(this.getPosition.x !== cameraPos[0]) {
                e.setCanceled = true;
            }
        }
    }

    //プレイヤーが敵に触れたら殺す
    entityContactEvent(e) {
        if(e.getTouchedEntity instanceof Player) {
            const player = e.getTouchedEntity;
            if (!player.gravityProperties.fallStart) {
                player.kill();
            } else {
                player.setPosition(player.getPosition.x, player.getPosition.y + this.bodySize.y);
                player.jump(this.gravityProperties.initialSpeed + 10);
                this.kill();
            }
        }
    }
}

export {Enemy};