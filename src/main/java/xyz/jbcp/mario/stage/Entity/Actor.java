package xyz.jbcp.mario.stage.Entity;

public enum Actor {
    Player(0),
    StandardEnemy(1),
    Midpoint(2),
    GoalPoint(3),
    FallBlock(4),
    SpawnInTheSky(5),
    FallStdEnemy(6),
    JumpTraceEnemy(7),
    NoGravityEnemy(8),
    MovingPole(9),
    ;

    private final int id;

    Actor(int id){
        this.id = id;
    }

    public int id() {
        return this.id;
    }
}
