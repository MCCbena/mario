package xyz.jbcp.mario.stage;

import java.util.ArrayList;

public class SendData {
    private ArrayList<BlockObject> blocks;

    public SendData(ArrayList<BlockObject> blocks) {
        this.blocks = blocks;
    }

    public ArrayList<BlockObject> getBlocks() {
        return blocks;
    }
}
