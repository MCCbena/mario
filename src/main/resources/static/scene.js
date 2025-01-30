import * as THREE from "three";

class Scene{
    method = [];
    constructor() {
        this.scene = new THREE.Scene();
    }

    add(object){
        this.scene.add(object);
    }
    remove(object){
        this.scene.remove(object);
    }

    /***
     @param method
     @param arg
     ***/
    addTickLoop(method, arg= null){
       this.method.push({
           "method": method,
           "arg": arg
       });
    }

    /**
     * @param method {method}
     */
    removeTickLoop(method){
        let index = -1;
        for (let i = 0; i < this.method.length; i++) {
            if(method===this.method[i].method){
                index = i;
            }
        }
        this.method.splice(index, 1);
    }

    render(renderer, camera){
        this.renderer = renderer;
        this.camera = camera;

        this.tick();
    }
    tick(){
        this.method.forEach(temp=>{
            if(temp.arg === null){
                temp.method();
            }else{
                temp.method(temp.arg);
            }
        })
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.tick.bind(this));
    }
}

export {Scene};