import * as THREE from "three";

class Camera{
    camera = null;
    scale = 1;
    toggleEntityInfo = {
        "toggled": false,
        "range": [],
        "player": null,
        "toggledStart": false,
    }

    constructor(width, height, scale) {
        this.camera = new THREE.PerspectiveCamera(45, width/height);
        this.scale = scale;
    }

    setPosition(x, y) {
        this.camera.position.set(parseInt(x*this.scale), parseInt(y*this.scale), 1000);
    }

    addPosition(x, y){
        this.camera.position.x += x*this.scale;
        this.camera.position.y += y*this.scale;
    }

    /**@return Readonly<{ x: number, y: number }*/
    get getPosition() {
        return Object.freeze({
            "x": this.camera.position.x/this.scale,
            "y": this.camera.position.y/this.scale
        })
    }

    /**
     *@type {Number[2]} range
     *@type {Entity} player
     */
    toggleEntity(range = [0, 0], player){
        this.toggleEntityInfo.toggled = true;
        //範囲の入れ替え
        if(range[0] > range[1]){
            const temp = range[0];
            range[0] = range[1];
            range[1] = temp;
        }
        this.toggleEntityInfo.range = range;
        this.toggleEntityInfo.player = player;
    }


    toggled(){
        if(this.toggleEntityInfo.toggled){
            const player = this.toggleEntityInfo.player;
            if(Math.abs(player.getPosition.x - this.getPosition.x) < 1){
                this.toggleEntityInfo.toggledStart = true;
            }

            //カメラが動く範囲を逸脱していないか
            if(this.toggleEntityInfo.toggledStart && player.getPosition.x < this.toggleEntityInfo.range[1] && this.getPosition.x < player.getPosition.x){
                this.setPosition(player.getPosition.x, this.getPosition.y);
            }
        }
    }

    updateStatus(){
        this.toggled();
    }
}

export {Camera}