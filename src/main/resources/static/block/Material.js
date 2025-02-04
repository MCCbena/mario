import {Air} from "./Air.js";
import {Floor} from "./Floor.js";
import {Property} from "../Property.js";

/*
typeリスト
AIR:空気オブジェクト
FLOOR:床ブロック
 */
const Material = Object.freeze({
    AIR: new Property(0, Air),
    FLOOR: new Property(1, Floor),

    //Materialに振られたIDからキーを取得
    getMaterial(id){
        for (let materialKey in Material) {
            if(id===Material[materialKey].properties.id){
                return Material[materialKey];
            }
        }
    }
});

export {Material}