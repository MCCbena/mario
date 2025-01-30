import * as THREE from "three";

class Player {
    sizeX = 30;
    sizeY = 50;
    scale = 0;

    gravityProperties = {
        "g": 0,
        "fallStartTime": null,
        "fallStart": false,
        "initialSpeed": 0,
        "inertialForce": 0,
    };

    status = {
        "isOnGround": true,
        "isOnCamera": false,
    }


    constructor(scale, gravity=9.8) {

        const material = new THREE.MeshNormalMaterial();
        const playerGeo = new THREE.BoxGeometry(this.sizeX, this.sizeY, 0);
        this.player = new THREE.Mesh(playerGeo, material);
        this.scale = scale;
        this.gravityProperties.g=gravity;
        this.player.onBeforeRender = () => {
            this.status.isOnCamera=true;
        }
    }

    //(x, y)
    setPosition(x, y) {
        this.player.position.set(parseInt(x*this.scale), parseInt(y*this.scale), 0);
    }

    addPosition(x, y) {
        this.player.position.x += parseInt(x*this.scale);
        this.player.position.y += parseInt(y*this.scale);
    }

    get getPosition() {
        return {
            "x": parseFloat(this.player.position.x)/this.scale,
            "y": parseFloat(this.player.position.y)/this.scale
        };
    }

    displayPlayer(scene){
        scene.add(this.player);
    }

    /** @return BlockObject */
    getNextBlock(world, place) {
        const pp = this.getPosition;
        switch (place) {
            case "bottom-right":
                pp.x+=0.9;
            case "bottom-left":
                pp.y-=0.1;
                break;

            case "top-right":
                pp.x+=0.9;
            case "top-left":
                pp.y+=0.1;
                break;

            case "left-top":
                pp.y+=0.9;
            case "left-bottom":
                pp.x-=0.8;
                break;

            case "right-top":
                pp.y+=0.9;
            case "right-bottom":
                pp.x+=0.8;
                break;

        }
        return world.getBlockObject(parseInt(pp.x), parseInt(pp.y));
    }
    /**
     placeはtop, bottom, left, right
     * @return boolean
     * */
    isHitInWorldObject(world, place){
        let block1 = null;
        let block2 = null;
        switch (place){
            case "top":
                block1 = this.getNextBlock(world, "top-left");
                block2 = this.getNextBlock(world, "top-right");
                break;
            case "bottom":
                block1 = this.getNextBlock(world, "bottom-left");
                block2 = this.getNextBlock(world, "bottom-right");
                break;
            case "left":
                block1 = this.getNextBlock(world, "left-top");
                block2 = this.getNextBlock(world, "left-bottom");
                break;
            case "right":
                block1 = this.getNextBlock(world, "right-top");
                block2 = this.getNextBlock(world, "right-bottom");
                break;
        }

        const block1HasHitbox = block1==null ? false : block1.getType.properties.hitbox;
        const block2HasHitbox = block2==null ? false : block2.getType.properties.hitbox;

        return block1HasHitbox || block2HasHitbox;
    }

    updateStatus(world){
        this.status.isOnGround = this.isHitInWorldObject(world, "bottom");
        this.applyGravity(world);
        this.status.isOnCamera = false;
    }

    applyGravity(world){
        //プレイヤーが落下を開始した時に動作
        if(!this.status.isOnGround && !this.gravityProperties.fallStart) {
            this.gravityProperties.fallStart = true;
            this.gravityProperties.fallStartTime = new Date();  //落下開始時刻を代入
        }

        //空中にいるとき
        if(this.gravityProperties.fallStart) {
            const g = this.gravityProperties.g; //重力加速度を取得
            const t = (new Date().getTime() - this.gravityProperties.fallStartTime.getTime())/1000; //経過時間を秒で取得
            const v0 = this.gravityProperties.initialSpeed;
            this.gravityProperties.initialSpeed/=1.2
            const y = v0 * t - (0.5 * g * t*t); //自由落下の公式により計算
            const player_fall_y = this.getPosition.y+y //プレイヤーの座標が何ブロック下になるかを計算
            const blocks = [
                world.getBlockObject(parseInt(this.getPosition.x), null),
                world.getBlockObject(parseInt(this.getPosition.x+0.9), null)
            ]; //指定したx軸のブロックオブジェクトをすべて取得
            for (let i = 0; i < blocks.length; i++) {
                //プレイヤーが上昇しているか降下しているかを判定
                if (y < 0) {
                    //落下の当たり判定制御
                    for (let y = parseInt(this.getPosition.y); y >= 0; y--) { //プレイヤーよりy軸が低いところにあるブロックオブジェクトをすべてループ
                        if (blocks[i][y].getType.properties.hitbox) { //ループしたブロックに当たり判定があれば
                            if (player_fall_y <= y + 1) { //算出された座標がプレイヤーの下にあるブロックの座標を下回っている場合
                                //プレイヤーの座標をブロックの座標+1に設定し、自由落下を解除
                                this.setPosition(this.getPosition.x, y + 1);
                                this.gravityProperties.fallStart = false;
                                return;
                            }
                        }
                    }
                } else {
                    //上昇時の当たり判定制御
                    for (let y = parseInt(this.getPosition.y); y < blocks[i].length; y++) { //プレイヤーよりy軸が低いところにあるブロックオブジェクトをすべてループ
                        if (blocks[i][y].getType.properties.hitbox) { //ループしたブロックに当たり判定があれば
                            if (player_fall_y > y - 1 && !this.isHitInWorldObject(world, "right") && !this.isHitInWorldObject(world, "left")) { //算出された座標がプレイヤーの上にあるブロックの座標を上回っている場合
                                //プレイヤーの座標をブロックの座標+1に設定し、初速を0
                                this.setPosition(this.getPosition.x, y - 1);
                                this.gravityProperties.initialSpeed = 0;
                                return;
                            }
                        }
                    }
                }
            }
            this.addPosition(0, y);
        }
    }

    jump(initialSpeed){
        this.gravityProperties.initialSpeed = initialSpeed;

        this.gravityProperties.fallStart = true;
        this.gravityProperties.fallStartTime = new Date();  //落下開始時刻を代入
    }
}

export {Player};