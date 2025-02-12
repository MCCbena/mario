import * as THREE from "three";

class Scene{
    #renderer = null;
    #camera = null;
    removeMethod = [];
    #method = [];
    constructor(backColor = null) {
        this.scene = new THREE.Scene();
        if(backColor !== null) this.scene.background = new THREE.Color(backColor);
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
     * webGLへシーンのレンダリングを開始します。
     * @param renderer {THREE.WebGLRenderer}
     * @param camera {Camera}
     */
    render(renderer, camera){
        this.#renderer = renderer;
        this.#camera = camera;
        this.addTickLoop(camera.updateStatus.bind(camera));

        this.tick();
    }

    /**
     * レンダリングを停止します。
     */
    stopRender(){
        this.stop = true;
    }

    /**
     * 停止した(stopRenderを実行したレンダリング)を再度実行します。
     *
     * 再レンダリングは問題を発生させる恐れがあります。
     */
    restartRender(){
        this.stop = undefined;
        this.tick();
    }

    tick(){
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
        if(this.stop===true) return;

        this.#method.forEach(temp=>{
            if(temp.arg === null){
                temp.method();
            }else{
                temp.method(temp.arg);
            }
        });

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