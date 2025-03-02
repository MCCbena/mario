import {Air} from "./Air.js";
import {Floor} from "./Floor.js";
import {Property} from "../Property.js";
import {Brick} from "./Brick.js";
import {Invisible} from "./Invisible.js";
import {HardBlock} from "./HardBlock.js";
import {BrittleBrick} from "./BrittleBrick.js";
import {HatenaBox} from "./HatenaBox.js";

/*
typeリスト
AIR:空気オブジェクト
FLOOR:床ブロック
 */
const Material = Object.freeze({
    AIR: new Property(0, Air),
    FLOOR: new Property(1, Floor),
    BRICK: new Property(2, Brick),
    INVISIBLE: new Property(3, Invisible),
    HARD_BLOCK: new Property(4, HardBlock),
    BRITTLE_BRICK: new Property(5, BrittleBrick),
    HATENA_BOX: new Property(6, HatenaBox),

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