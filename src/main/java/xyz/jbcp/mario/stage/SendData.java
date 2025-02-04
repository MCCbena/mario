package xyz.jbcp.mario.stage;

import xyz.jbcp.mario.stage.Block.BlockObject;

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
