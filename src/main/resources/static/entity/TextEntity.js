import {Entity} from "./Entity.js";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as THREE from "three";


class TextEntity extends Entity{
    /**
     * @param scale {Number}
     * @param text {String}
     * @param fontPath {String}
     * @param camera {Camera}
     * @param param
     * @param color {Number}
     */
    constructor(scale, text, fontPath, camera, param={size:100}, color=0xFFFFFF) {
        super(null, scale,1, {"noAI": true});
        // Fonts

        return new Promise((resolve)=> {
            const fontLoader = new FontLoader();
            fontLoader.load(fontPath, (font) => {
                param.font=font;
                param.height=1;
                /**
                 font: font,
                 size: 100,
                 height: 1,
                 curveSegments: 12,
                 bevelEnabled: true,
                 bevelThickness: 0.04,
                 bevelSize: 0.02,
                 bevelOffset: 0,
                 bevelSegments: 5,
                 **/
                const textGeometry = new TextGeometry(text, param);
                textGeometry.center();

                // material

                const textMaterial = new THREE.MeshBasicMaterial({color:color});

                // mesh
                this.entity = new THREE.Mesh(textGeometry, textMaterial);

                this.entity.lookAt(camera.rawCamera.position);
                this.entity.position.z -= 30;

                resolve(this);
            });
        });
    }
    setPosition(x, y) {
        this.entity.position.set(parseInt(x*this.scale), parseInt(y*this.scale), 1000-30);
    }
}

export {TextEntity}