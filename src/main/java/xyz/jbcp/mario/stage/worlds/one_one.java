package xyz.jbcp.mario.stage.worlds;

import xyz.jbcp.mario.stage.Block.BlockObject;
import xyz.jbcp.mario.stage.Block.Material;
import xyz.jbcp.mario.stage.Entity.Actor;
import xyz.jbcp.mario.stage.Entity.EntityObject;
import xyz.jbcp.mario.stage.WorldObject;

public class one_one {
    public static WorldObject get() {
        EntityObject entityObject;

        WorldObject worldObject = new WorldObject(120, 120);


        EntityObject player = new EntityObject(1, 1, Actor.Player);
        player.getNbt().put("toggleCamera", true);
        player.getNbt().put("toggleCameraStart", 0);
        player.getNbt().put("toggleCameraStop", 1000);
        worldObject.addEntity(player);


        worldObject.addEntity(new EntityObject(12, 5, Actor.StandardEnemy));

        //床を設置
        for(int i = 0; i < 2000; i++){
            worldObject.setBlock(new BlockObject(i, 0, Material.FLOOR));
        }
        worldObject.setBlock(new BlockObject(0, 1, Material.FLOOR));

        //穴
        for (int x = 0; x < 7; x++) {
            if(x!=3) worldObject.setBlock(new BlockObject(x+3, 0, Material.AIR));
            else {
                worldObject.setBlock(new BlockObject(x+4, 3, Material.INVISIBLE));
            }
        }
        worldObject.addEntity(new EntityObject(6, 1, Actor.SpawnInTheSky));

        //壁
        for (int y = 0; y < 6; y++) {
            for (int x = 0; x < y; x++) {
                worldObject.setBlock(new BlockObject(22+y, 1+x, Material.HARD_BACK));
            }
        }
        for (int x = 0; x < 3; x++) {
            worldObject.setBlock(new BlockObject(29+x, 0, Material.AIR));
        }

        worldObject.setBlock(new BlockObject(30, 4, Material.BRITTLE_BRICK));
        worldObject.setBlock(new BlockObject(33, 1, Material.HARD_BACK));


        for (int x = 0; x < 6; x++) {
            for(int y = 0; y < 3; y++){
                worldObject.setBlock(new BlockObject(x+37, y+1, Material.HARD_BACK));
            }
        }

        for (int x = 0; x < 5; x++) {
            worldObject.setBlock(new BlockObject(x+43, 3, Material.INVISIBLE));
        }
        worldObject.setBlock(new BlockObject(43, 6, Material.INVISIBLE));
        worldObject.setBlock(new BlockObject(44, 9, Material.INVISIBLE));
        worldObject.addEntity(new EntityObject(43, 1, Actor.StandardEnemy));

        for (int x = 0; x < 5; x++) {
            for(int y = 0; y < 3; y++){
                worldObject.setBlock(new BlockObject(x+48, y+1, Material.HARD_BACK));
            }
        }

        entityObject = new EntityObject(48, 4, Actor.SpawnInTheSky);
        entityObject.getNbt().put("spawnX", 49);
        worldObject.addEntity(entityObject);

        worldObject.setBlock(new BlockObject(53, 6, Material.HATENA_BOX));
        worldObject.setBlock(new BlockObject(54, 6, Material.BRICK));

        entityObject = new EntityObject(56, 10, Actor.FallBlock);
        entityObject.getNbt().put("sizeX", 3);
        entityObject.getNbt().put("sizeY", 1);
        entityObject.getNbt().put("g", 4.6);
        entityObject.getNbt().put("texture", "images/brick.png");
        worldObject.addEntity(entityObject);

        for (int x = 0; x < 6; x++) {
            worldObject.setBlock(new BlockObject(x+60, 0, Material.AIR));
        }
        entityObject = new EntityObject(64, 0, Actor.FallBlock);
        entityObject.getNbt().put("sizeX", 3);
        entityObject.getNbt().put("sizeY", 1);
        entityObject.getNbt().put("texture", "images/floor.png");
        worldObject.addEntity(entityObject);

        entityObject = new EntityObject(70, 1, Actor.StandardEnemy);
        entityObject.getNbt().put("speed", -0.05);
        worldObject.addEntity(entityObject);
        entityObject = new EntityObject(73, 1, Actor.StandardEnemy);
        entityObject.getNbt().put("speed", -0.05);
        worldObject.addEntity(entityObject);

        for (int x = 0; x < 7; x++) {
            worldObject.setBlock(new BlockObject(x+68, 5, Material.BRICK));
        }
        worldObject.addEntity(new EntityObject(74, 6, Actor.Midpoint));

        for (int x = 0; x < 4; x++) {
            for (int y = 0; y < x; y++) {
                worldObject.setBlock(new BlockObject(x+77, y+1, Material.HARD_BACK));
            }
        }

        for (int x = 0; x < 4; x++) {
            for (int y = 0; y < x; y++) {
                worldObject.setBlock(new BlockObject(85-x, y+1, Material.HARD_BACK));
            }
        }
        worldObject.setBlock(new BlockObject(81, 0, Material.AIR));
        entityObject = new EntityObject(81, 5, Actor.SpawnInTheSky);
        entityObject.getNbt().put("sizeX", 1);
        entityObject.getNbt().put("sizeY", 10);
        worldObject.addEntity(entityObject);

        for (int x = 0; x < 2; x++) {
            worldObject.setBlock(new BlockObject(86+x, 0, Material.AIR));
        }

        worldObject.setBlock(new BlockObject(85, 3, Material.INVISIBLE));

        entityObject = new EntityObject(86.5, 0, Actor.FallBlock);
        entityObject.getNbt().put("sizeX", 2);
        entityObject.getNbt().put("sizeY", 1);
        entityObject.getNbt().put("texture", "images/floor.png");
        worldObject.addEntity(entityObject);

        for (int x = 0; x < 3; x++) {
            worldObject.setBlock(new BlockObject(90+x, 6, Material.BRICK));
        }
        worldObject.setBlock(new BlockObject(93, 6, Material.HATENA_BOX));

        for (int i = 0; i < 12; i+=2) {
            entityObject = new EntityObject(94+i, 6, Actor.StandardEnemy);
            entityObject.getNbt().put("speed", -0.05);
            worldObject.addEntity(entityObject);
        }

        for (int x = 0; x < 10; x++) {
            worldObject.setBlock(new BlockObject(96+x, 6, Material.BRICK));
            worldObject.setBlock(new BlockObject(96+x, 9, Material.INVISIBLE));
        }

        for (int x = 0; x < 3; x++) {
            worldObject.setBlock(new BlockObject(106+x, 0, Material.AIR));
        }
        worldObject.setBlock(new BlockObject(107, 9, Material.INVISIBLE));
        entityObject = new EntityObject(107, 7, Actor.SpawnInTheSky);
        entityObject.getNbt().put("spawnX", 110);
        worldObject.addEntity(entityObject);

        entityObject = new EntityObject(107, 6, Actor.FallBlock);
        entityObject.getNbt().put("sizeX", 3);
        entityObject.getNbt().put("sizeY", 1);
        entityObject.getNbt().put("texture", "images/brick.png");
        worldObject.addEntity(entityObject);

        worldObject.addEntity(new EntityObject(113, 1, Actor.GoalPoint));
        
        return worldObject;
    }
}
