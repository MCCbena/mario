package xyz.jbcp.mario.stage.worlds;

import xyz.jbcp.mario.stage.Block.BlockObject;
import xyz.jbcp.mario.stage.Block.Material;
import xyz.jbcp.mario.stage.Entity.Actor;
import xyz.jbcp.mario.stage.Entity.EntityObject;
import xyz.jbcp.mario.stage.WorldObject;

import java.util.ArrayList;

public class one_one {
    public static WorldObject get() {
        WorldObject worldObject = new WorldObject(2000, 2000);

        EntityObject player = new EntityObject(1, 4, Actor.Player);
        player.getNbt().put("toggleCamera", true);
        player.getNbt().put("toggleCameraStart", 0);
        player.getNbt().put("toggleCameraStop", 20);
        worldObject.addEntity(player);


        //床を設置
        for(int i = 0; i < 2000; i++){
            worldObject.setBlock(new BlockObject(i, 0, Material.FLOOR));
        }
        worldObject.setBlock(new BlockObject(0, 1, Material.FLOOR));
        for (int i = 0; i < 6; i++) {
            if(i!=3) worldObject.setBlock(new BlockObject(i+3, 0, Material.AIR));
            else worldObject.addEntity(new EntityObject(i+4, 3, Actor.InvisibleBlock));
        }
        worldObject.addEntity(new EntityObject(0, 0, Actor.Enemy));

        worldObject.addEntity(new EntityObject(12, 1, Actor.Midpoint));
        worldObject.addEntity(new EntityObject(12, 5, Actor.Enemy));
        worldObject.addEntity(new EntityObject(22, 1, Actor.GoalPoint));
        worldObject.setBlock(new BlockObject(23, 1, Material.FLOOR));


        return worldObject;
    }
}
