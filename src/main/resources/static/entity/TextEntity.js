import {Entity} from "./Entity.js";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';


class TextEntity extends Entity{
    /**
     * @param scale {Number}
     * @param fontPath {String}
     * @param camera
     */
    constructor(scale, fontPath, camera) {
        super(null, scale,1, {"noAI": true});
        // 表示させたい文字

        const text = "死";

// Fonts

        return new Promise((resolve)=> {
            const fontLoader = new FontLoader();
            fontLoader.load("M PLUS 1 Code_Regular.json", (font) => {
                const textGeometry = new TextGeometry(text, {
                    font: font,
                    size: 100,
                    height: 1,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.04,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5,
                });
                textGeometry.center();

                // material

                const textMaterial = new THREE.MeshNormalMaterial();

                // mesh
                this.entity = new THREE.Mesh(textGeometry, textMaterial);
                //1000はカメラに設定されているz座標で、30は文字が貫通せずに表示できるギリギリの座標。

                this.entity.lookAt(new THREE.Vector3(320, 240, 1000-30));

                this.sizeX = 10;
                this.sizeY = 10;

                resolve(this);
            });
        });
    }
    setPosition(x, y) {
        this.entity.position.set(parseInt(x*this.scale), parseInt(y*this.scale), 1000-30);
        console.log(this.entity.position);
    }
}

export {TextEntity}