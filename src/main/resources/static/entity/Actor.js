import {Property} from "../Property.js";
import {Player} from "./Player.js";
import {Enemy} from "./Enemy.js";
import {Midpoint} from "./Midpoint.js";
import {GoalPoint} from "./GoalPoint.js";

const Actor = Object.freeze({
    Player: new Property(0, Player),
    Enemy: new Property(1, Enemy),
    Midpoint: new Property(2, Midpoint),
    GoalPoint: new Property(3, GoalPoint),

    //Materialに振られたIDからキーを取得
    getActor(id){
        for (let actorKey in Actor) {
            if(id===Actor[actorKey].properties.id){
                return Actor[actorKey];
            }
        }
    }
});

export {Actor};