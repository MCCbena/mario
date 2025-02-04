import * as THREE from "three";
import {limit} from "./micro-util.js";

class Camera{
    camera = null;
    scale = 1;
    width = 0;
    height = 0;
    toggleEntityInfo = {
        "toggled": false,
        "range": [],
        "player": null,
        "toggledStart": false,
    }

    constructor(width, height, scale) {
        this.width = width;
        this.height = height;
        this.camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 1000);
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

    get getWidth(){
        return this.width;
    }

    get getHeight(){
        return this.height;
    }

    /**
     * THREE.js内部で実装されているOrthographicCameraインスタンスを返します。
     * @returns {THREE.OrthographicCamera}
     */
    get rawCamera(){
        return this.camera;
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

    /**
     * x, yがカメラに映っているかを判定します。
     * @param x {Number}
     * @param y {Number}
     */
    onCamera(x, y){
        const range_width = this.width/2/this.scale;
        const range_height = this.height/2/this.scale;

        return !(Math.abs(this.getPosition.x - x) >= range_width || Math.abs(this.getPosition.y - y) >= range_height);
    }

    /**
     * x, yをカメラ内に映れる最大の座標に正規化します。
     *
     * 例：カメラの座標がx=5で、width=10の場合、カメラに映る最大の座標はx=0〜10となる。このメソッドにx=19を代入すると10になる。-1を代入すると0になる。
     * @param x {Number}
     * @param y {Number}
     */
    onCameraPosition(x, y){
        const range_width = this.width/2/this.scale;
        const range_height = this.height/2/this.scale;

        const min_y = this.getPosition.y-range_height, max_y = this.getPosition.y+range_height;
        const min_x = this.getPosition.x-range_width, max_x = this.getPosition.x+range_width;

        return [limit(min_x, max_x, x), limit(min_y, max_y, y)];
    }

    updateStatus(){
        this.toggled();
    }
}

export {Camera}