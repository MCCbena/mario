package xyz.jbcp.mario.stage.Block;

import java.util.HashMap;

public class BlockObject {
    private int x;
    private int y;
    private Material type;
    private final HashMap<String, Object> nbt = new HashMap<>();
    public BlockObject(int x, int y, Material material) {
        this.x = x;
        this.y = y;
        this.type = material;
    }

    public int getX() {
        return x;
    }
    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public Material getType() {
        return type;
    }

    public void setType(Material type) {
        this.type = type;
    }

    public HashMap<String, Object> getNbt() {
        return nbt;
    }
}
