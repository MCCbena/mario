package xyz.jbcp.mario.stage.Entity;

public enum Actor {
    Player(0),
    Enemy(1),
    Midpoint(2),
    GoalPoint(3),
    InvisibleBlock(4),
    ;

    private final int id;

    Actor(int id){
        this.id = id;
    }

    public int id() {
        return this.id;
    }
}
