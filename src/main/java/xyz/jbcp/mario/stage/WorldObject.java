package xyz.jbcp.mario.stage;

import jakarta.annotation.Nullable;

import java.util.ArrayList;

public class WorldObject {
    final private int width;
    final private int height;
    final private ArrayList<BlockObject> blockObjects;
    public WorldObject(int width, int height) {
        this.width = width;
        this.height = height;
        this.blockObjects = new ArrayList<>();

        for(int y = 0; y < this.height; y++){
            for(int x = 0; x < this.width; x++){
                BlockObject blockObject = new BlockObject(x, y, Material.AIR);
                blockObjects.add(blockObject);
            }
        }
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
