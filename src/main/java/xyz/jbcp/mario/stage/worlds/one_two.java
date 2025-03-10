package xyz.jbcp.mario.stage.worlds;

import xyz.jbcp.mario.stage.Block.BlockObject;
import xyz.jbcp.mario.stage.Block.Material;
import xyz.jbcp.mario.stage.Entity.Actor;
import xyz.jbcp.mario.stage.Entity.EntityObject;
import xyz.jbcp.mario.stage.WorldObject;

import java.util.ArrayList;

public class one_two {
    public static WorldObject get(){
        EntityObject entityObject;
        BlockObject blockObject;

        WorldObject worldObject = new WorldObject(132, 120);


        EntityObject player = new EntityObject(1, 1, Actor.Player);


        player.getNbt().put("toggleCamera", true);
        player.getNbt().put("toggleCameraStart", 0);
        player.getNbt().put("toggleCameraStop", 124);
        worldObject.addEntity(player);

        //床を設置
        for(int i = 0; i < 130; i++){
            worldObject.setBlock(new BlockObject(i, 0, Material.FLOOR));
        }

        for(int i = 0; i < 3; i++){
            worldObject.setBlock(new BlockObject(i+2, 0, Material.AIR));
        }
        entityObject = new EntityObject(3, 0, Actor.FallBlock);
        entityObject.getNbt().put("sizeX", 3);
        entityObject.getNbt().put("sizeY", 1);
        entityObject.getNbt().put("texture", "images/floor.png");
        worldObject.addEntity(entityObject);

        for (int x = 0; x < 5; x++) {
            worldObject.setBlock(new BlockObject((x*2)+5, 0, Material.AIR));
            worldObject.setBlock(new BlockObject((x*2)+6, 0, Material.AIR));


            entityObject = new EntityObject((x*2+1)+5, x*2, Actor.SpawnInTheSky);
            entityObject.getNbt().put("sizeX", 1);
            entityObject.getNbt().put("sizeY", 10);
            entityObject.getNbt().put("entityNBT", "{\"g\":39.2}");
            if(x%2!=0) entityObject.getNbt().put("spawnX", x*2+7);
            worldObject.addEntity(entityObject);
            for (int y = 1; y <= x+1; y++) {

                if(x!=2) worldObject.setBlock(new BlockObject((x*2)+5, y, Material.HARD_BACK));
            }
        }

        entityObject = new EntityObject(9, 1, Actor.FallBlock);
        entityObject.getNbt().put("sizeX", 1);
        entityObject.getNbt().put("sizeY", 3);
        entityObject.getNbt().put("texture", "images/hardBlock.png");
        worldObject.addEntity(entityObject);


        worldObject.setBlock(new BlockObject(17, 5, Material.BRITTLE_BRICK));

        entityObject = new EntityObject(25, 2, Actor.JumpTraceEnemy);
        entityObject.getNbt().put("speed", -0.05);
        worldObject.addEntity(entityObject);

        blockObject = new BlockObject(23, 5, Material.HATENA_BOX);
        blockObject.getNbt().put("entityID", Actor.Midpoint.id());
        worldObject.setBlock(blockObject);

        blockObject = new BlockObject(27, 5, Material.HATENA_BOX);
        blockObject.getNbt().put("entityID", Actor.JumpTraceEnemy.id());
        worldObject.setBlock(blockObject);

        blockObject = new BlockObject(25, 8, Material.HATENA_BOX);
        worldObject.setBlock(blockObject);


        worldObject.setBlock(new BlockObject(30, 1, Material.HARD_BACK));
        worldObject.setBlock(new BlockObject(31, 1, Material.HARD_BACK));
        worldObject.setBlock(new BlockObject(31, 2, Material.HARD_BACK));

        for (int x = 0; x < 11; x++) {
            worldObject.setBlock(new BlockObject(32+x, 0, Material.AIR));
        }

        worldObject.setBlock(new BlockObject(34, 2, Material.BRICK));

        worldObject.setBlock(new BlockObject(38, 2, Material.BRITTLE_BRICK));

        worldObject.setBlock(new BlockObject(40, 2, Material.BRICK));
        worldObject.setBlock(new BlockObject(41, 5, Material.INVISIBLE));

        entityObject = new EntityObject(41, 6, Actor.SpawnInTheSky);
        entityObject.getNbt().put("entityID", Actor.NoGravityEnemy.id());
        entityObject.getNbt().put("entityNBT", "{\"speed\":-1}");
        entityObject.getNbt().put("spawnX", 47);
        entityObject.getNbt().put("spawnY", 6);
        worldObject.addEntity(entityObject);


        worldObject.setBlock(new BlockObject(43, 2, Material.HARD_BACK));
        worldObject.setBlock(new BlockObject(43, 1, Material.HARD_BACK));
        worldObject.setBlock(new BlockObject(44, 1, Material.HARD_BACK));

        entityObject = new EntityObject(55, 1, Actor.StandardEnemy);
        entityObject.getNbt().put("speed", -0.05);

        worldObject.setBlock(new BlockObject(46, 7, Material.HATENA_BOX));

        entityObject = new EntityObject(46, 8, Actor.SpawnInTheSky);
        entityObject.getNbt().put("spawnY", 8);
        entityObject.getNbt().put("entityNBT", "{\"g\":100}");
        worldObject.addEntity(entityObject);
        worldObject.addEntity(new EntityObject(46, 8, Actor.SpawnInTheSky));

        worldObject.setBlock(new BlockObject(47, 6, Material.BRICK));
        entityObject = new EntityObject(48.5, 6, Actor.FallBlock);
        entityObject.getNbt().put("sizeX", 2);
        entityObject.getNbt().put("sizeY", 1);
        entityObject.getNbt().put("texture", "images/brick.png");
        entityObject.getNbt().put("g", 29.4);
        worldObject.addEntity(entityObject);

        entityObject = new EntityObject(50.5, 6, Actor.FallBlock);
        entityObject.getNbt().put("sizeX", 2);
        entityObject.getNbt().put("sizeY", 1);
        entityObject.getNbt().put("texture", "images/brick.png");
        entityObject.getNbt().put("g", 29.4);
        worldObject.addEntity(entityObject);

        for (int x = 0; x < 3; x++) {
            worldObject.setBlock(new BlockObject(52+x, 0, Material.AIR));
        }

        entityObject = new EntityObject(53, 0, Actor.FallBlock);
        entityObject.getNbt().put("sizeX", 3);
        entityObject.getNbt().put("sizeY", 1);
        entityObject.getNbt().put("texture", "images/floor.png");
        worldObject.addEntity(entityObject);

        for (int x = 0; x < 21; x++) {
            worldObject.setBlock(new BlockObject(56+x, 0, Material.BRITTLE_BRICK));
        }

        worldObject.setBlock(new BlockObject(56, 3, Material.INVISIBLE));

        worldObject.setBlock(new BlockObject(63, 5, Material.BRICK));
        worldObject.setBlock(new BlockObject(62, 5, Material.BRICK));

        entityObject = new EntityObject(69, 5.5, Actor.MovingPole);
        entityObject.getNbt().put("sizeX", 0.6);
        entityObject.getNbt().put("speedX", -0.1);
        worldObject.addEntity(entityObject);

        entityObject = new EntityObject(69, 8, Actor.MovingPole);
        entityObject.getNbt().put("sizeX", 0.6);
        entityObject.getNbt().put("speedX", -0.1);
        worldObject.addEntity(entityObject);

        worldObject.setBlock(new BlockObject(69, 5, Material.BRICK));
        worldObject.setBlock(new BlockObject(70, 5, Material.BRICK));
        worldObject.setBlock(new BlockObject(71, 8, Material.INVISIBLE));;

        entityObject = new EntityObject(64, 2, Actor.JumpTraceEnemy);
        entityObject.getNbt().put("speed", -0.05);
        worldObject.addEntity(new EntityObject(56, 2, Actor.JumpTraceEnemy));

        for (int y = 0; y < 7; y++) {
            worldObject.setBlock(new BlockObject(77, y+1, Material.BRICK));
        }


        worldObject.setBlock(new BlockObject(80, 5, Material.BRITTLE_BRICK));
        worldObject.setBlock(new BlockObject(81, 5, Material.BRITTLE_BRICK));
        worldObject.setBlock(new BlockObject(82, 5, Material.BRICK));
        worldObject.addEntity(new EntityObject(82, 6, Actor.Midpoint));

        for (int x = 0; x < 10; x++) {
            worldObject.setBlock(new BlockObject(x+78, 0, Material.AIR));
        }

        worldObject.setBlock(new BlockObject(84, 3, Material.BRICK));

        entityObject = new EntityObject(90, 1, Actor.SpawnInTheSky);
        entityObject.getNbt().put("entityID", Actor.NoGravityEnemy.id());
        entityObject.getNbt().put("entityNBT", "{\"speed\":-1}");
        entityObject.getNbt().put("spawnX", 95);
        entityObject.getNbt().put("spawnY", 1);
        worldObject.addEntity(entityObject);

        entityObject = new EntityObject(95, 1, Actor.StandardEnemy);
        entityObject.getNbt().put("speed", -0.05);
        worldObject.addEntity(entityObject);

        for (int x = 0; x < 20; x++) {
            worldObject.setBlock(new BlockObject(x+100, 0, Material.AIR));
        }

        entityObject = new EntityObject(96, 3, Actor.FallBlock);
        entityObject.getNbt().put("sizeX", 1);
        entityObject.getNbt().put("sizeY", 1);
        entityObject.getNbt().put("texture", "images/hatenaBOX.jpg");
        entityObject.getNbt().put("g", 29.4);
        worldObject.addEntity(entityObject);

        worldObject.setBlock(new BlockObject(103, 3, Material.BRICK));
        worldObject.setBlock(new BlockObject(104, 3, Material.BRICK));
        worldObject.setBlock(new BlockObject(105, 3, Material.BRICK));
        worldObject.setBlock(new BlockObject(106, 3, Material.BRITTLE_BRICK));

        for (int x = 0; x < 6; x++) {
            worldObject.setBlock(new BlockObject(111+x, 4, Material.BRICK));
            worldObject.setBlock(new BlockObject(111+x, 0, Material.BRICK));
        }

        entityObject = new EntityObject(116, 5, Actor.JumpTraceEnemy);
        entityObject.getNbt().put("speed", -0.03);
        worldObject.addEntity(entityObject);


        String[] poleNBTs = {"{\"speedX\": -0.2, \"speedY\": 0.13}", "{\"speedX\": -0.2, \"speedY\": 0.09}", "{\"speedX\": -0.2, \"speedY\": 0.04}", "{\"speedX\": -0.2, \"speedY\": 0.01}", "{\"speedX\": -0.2, \"speedY\": -0.04}", "{\"speedX\": -0.2, \"speedY\": -0.07}", "{\"speedX\": -0.2, \"speedY\": -0.09}", "{\"speedX\": -0.2, \"speedY\": -0.12}"};

        for (String poleNBT : poleNBTs) {
            entityObject = new EntityObject(116, 5, Actor.SpawnInTheSky);
            entityObject.getNbt().put("sizeY", 10);
            entityObject.getNbt().put("entityID", Actor.MovingPole.id());
            entityObject.getNbt().put("entityNBT", poleNBT);
            entityObject.getNbt().put("spawnX", 122);
            entityObject.getNbt().put("spawnY", 5);
            worldObject.addEntity(entityObject);
        }

        entityObject = new EntityObject(125, 1, Actor.SpawnInTheSky);
        entityObject.getNbt().put("spawnX", 127);
        entityObject.getNbt().put("entityNBT", "{\"g\":19.6}");
        worldObject.addEntity(entityObject);

        entityObject = new EntityObject(129, 1, Actor.GoalPoint);
        entityObject.getNbt().put("nextWorld", "1-1");

        worldObject.addEntity(entityObject);

        return worldObject;
    }
}
