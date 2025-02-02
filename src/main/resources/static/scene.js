import * as THREE from "three";

class Scene{
    #renderer = null;
    #camera = null;
    removeMethod = [];
    #method = [];
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xA0B4FA);
    }

    add(object){
        this.scene.add(object);
    }
    remove(object){
        this.scene.remove(object);
    }

    /***
     ティックループに指定したメソッドを追加します。
     ティックループに追加されたメソッドは、レンダリングされる前に呼ばれ続けます。
     @param method
     @param arg
     ***/
    addTickLoop(method, arg= null){
       this.#method.push({
           "method": method,
           "arg": arg
       });
    }

    /**
     * ティックループに追加されたメソッドを削除します。
     * この関数を実行したとしてもすぐにティックループからメソッドが削除されるわけではありません。
     * 一回のティックループが終了したときに削除されます。
     * @param method {#method}
     */
    removeTickLoop(method){
        this.removeMethod.push(method);
    }

    /**
     * @param renderer {THREE.WebGLRenderer}
     * @param camera {Camera}
     */
    render(renderer, camera){
        this.#renderer = renderer;
        this.#camera = camera;

        this.tick();
    }
    tick(){
        this.#method.forEach(temp=>{
            if(temp.arg === null){
                temp.method();
            }else{
                temp.method(temp.arg);
            }
        });

        //ループ関数の削除を実装
        this.removeMethod.forEach(method=>{
            let index = 0;
            for (let methodElement of this.#method) {
                if(methodElement.method===method){
                    this.#method.splice(index, 1);
                    break;
                }
                index++;
            }
        });
        this.removeMethod = [];

        this.#renderer.render(this.scene, this.camera.rawCamera);
        requestAnimationFrame(this.tick.bind(this));
    }

    /**
     * カメラを取得できます。renderメソッドが呼び出されていない場合、nullを返します。
     */
    get camera(){
        return this.#camera;
    }
}

export {Scene};