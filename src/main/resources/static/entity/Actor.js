import {Property} from "../Property.js";
import {Player} from "./Player.js";
import {Enemy} from "./Enemy.js";

const Actor = Object.freeze({
    Player: new Property(0, Player),
    Enemy: new Property(1, Enemy),

    //Materialに振られたIDからキーを取得
    getActor(id){
        for (let actorKey in Actor) {
            if(id===Actor[actorKey].properties.id){
                return Actor[actorKey];
            }
        }
    }
});

export {Actor}