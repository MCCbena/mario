package xyz.jbcp.mario.stage;

import jakarta.annotation.Nullable;
import xyz.jbcp.mario.stage.Block.BlockObject;
import xyz.jbcp.mario.stage.Block.Material;
import xyz.jbcp.mario.stage.Entity.EntityObject;

import java.util.ArrayList;

public class WorldObject {
    final private int width;
    final private int height;
    final private ArrayList<BlockObject> blockObjects;
    final private ArrayList<EntityObject> entityObjects;

    public WorldObject(int width, int height) {
        this.width = width;
        this.height = height;

        //ブロック情報を保存する配列を構築
        this.blockObjects = new ArrayList<>();

        for(int y = 0; y < this.height; y++){
            for(int x = 0; x < this.width; x++){
                BlockObject blockObject = new BlockObject(x, y, Material.AIR);
                blockObjects.add(blockObject);
            }
        }

        //エンティティ情報を保存する配列を構築
        this.entityObjects = new ArrayList<>();
    }

    public void setBlock(BlockObject blockObject){
        for (int i = 0; i < this.blockObjects.size(); i++) {
            BlockObject temp = this.blockObjects.get(i);
            if(temp.getX() == blockObject.getX() && temp.getY() == blockObject.getY()) {
                this.blockObjects.set(i, blockObject);
                break;
            }
        }
    }

    @Nullable
    public BlockObject getBlock(int x, int y) {
        for(BlockObject temp: this.blockObjects){
            if(temp.getX() == x && temp.getY() == y) {
                return temp;
            }
        }
        return null;
    }

    public void addEntity(EntityObject entityObject){
        this.entityObjects.add(entityObject);
    }

    public ArrayList<EntityObject> getEntities() {
        return entityObjects;
    }

    public ArrayList<BlockObject> getBlocks() {
        return blockObjects;
    }

    public int getWidth() {
        return width;
    }
    public int getHeight() {
        return height;
    }
}
