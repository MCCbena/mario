package xyz.jbcp.mario.stage.Block;

public enum Material{
    AIR(0),
    FLOOR(1),
    BRICK(2),
    INVISIBLE(3),
    HARD_BACK(4),
    BRITTLE_BRICK(5),
    HATENA_BOX(6),

    ;

    private final int id;

    Material(int id){
        this.id = id;
    }

    public int id() {
        return this.id;
    }
}
