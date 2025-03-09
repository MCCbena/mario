import {Property} from "../Property.js";
import {Player} from "./Player.js";
import {StandardEnemy} from "./StandardEnemy.js";
import {Midpoint} from "./Midpoint.js";
import {GoalPoint} from "./GoalPoint.js";
import {FallBlock} from "./FallBlock.js";
import {SpawnInTheSky} from "./SpawnInTheSky.js";
import {FallStdEnemy} from "./FallStdEnemy.js";
import {JumpTraceEnemy} from "./JumpTraceEnemy.js";
import {NoGravityEnemy} from "./NoGravityEnemy.js";
import {MovingPole} from "./MovingPole.js";

const Actor = Object.freeze({
    Player: new Property(0, Player),
    StandardEnemy: new Property(1, StandardEnemy),
    Midpoint: new Property(2, Midpoint),
    GoalPoint: new Property(3, GoalPoint),
    FallBlock: new Property(4, FallBlock),
    SpawnInTheSky: new Property(5, SpawnInTheSky),
    FallStdEnemy: new Property(6, FallStdEnemy),
    JumpTraceEnemy: new Property(7, JumpTraceEnemy),
    NoGravityEnemy: new Property(8, NoGravityEnemy),
    MovingPole: new Property(9, MovingPole),

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