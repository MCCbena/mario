package xyz.jbcp.mario.stage.Block;

public enum Material{
    AIR(0),
    FLOOR(1)
    ;

    private final int id;

    Material(int id){
        this.id = id;
    }

    public int id() {
        return this.id;
    }
}
