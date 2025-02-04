package xyz.jbcp.mario.stage.Entity;

import java.util.HashMap;

public class EntityObject {
    private double x;
    private double y;
    private Actor type;
    private final HashMap<String, Object> nbt = new HashMap<>();

    public EntityObject(double x, double y, Actor type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public Actor getType() {
        return type;
    }

    public void setType(Actor type) {
        this.type = type;
    }

    public HashMap<String, Object> getNbt() {
        return nbt;
    }
}
