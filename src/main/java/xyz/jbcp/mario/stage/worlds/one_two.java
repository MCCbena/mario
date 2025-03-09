package xyz.jbcp.mario.stage.worlds;

import xyz.jbcp.mario.stage.Block.BlockObject;
import xyz.jbcp.mario.stage.Block.Material;
import xyz.jbcp.mario.stage.Entity.Actor;
import xyz.jbcp.mario.stage.Entity.EntityObject;
import xyz.jbcp.mario.stage.WorldObject;

public class one_two {
    public static WorldObject get(){
        EntityObject entityObject;

        WorldObject worldObject = new WorldObject(120, 120);


        EntityObject player = new EntityObject(1, 1, Actor.Player);
        player.getNbt().put("toggleCamera", true);
        player.getNbt().put("toggleCameraStart", 0);
        player.getNbt().put("toggleCameraStop", 1000);
        worldObject.addEntity(player);

        //床を設置
        for(int i = 0; i < 120; i++){
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
            worldObject.addEntity(entityObject);
            for (int y = 1; y <= x+1; y++) {

                if(x!=2) worldObject.setBlock(new BlockObject((x*2)+5, y, Material.HARD_BACK));
            }
        }

        entityObject = new EntityObject(9, 1, Actor.FallBlock);
        entityObject.getNbt().put("sizeX", 1);
        entityObject.getNbt().put("sizeY", 3);
        entityObject.getNbt().put("texture", "images/floor.png");
        worldObject.addEntity(entityObject);

        return worldObject;
    }
}
