package xyz.jbcp.mario.stage;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

public class SocketController extends TextWebSocketHandler {
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("WebSocketの接続が確立しました。");
    }
    /**
     * メッセージの送受信
     */
    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) {
        System.out.println("メッセージ受信:" + message.getPayload());
        String responseJson = "";
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ReceiveData receiveData = objectMapper.readValue(message.getPayload(), ReceiveData.class);

            responseJson = getStage(receiveData.number);
            TextMessage responseMessage = new TextMessage(responseJson);
            session.sendMessage(responseMessage);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    /**
     * 接続終了
     */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("WebSocketの接続が終了しました。");
    }

    private String getStage(String number) {
        WorldObject worldObject = new WorldObject(100, 100);
        for(int i = 0; i < 100; i++){
            if(i!=2) {
                if(i+1%10!=0) {
                    BlockObject blockObject = new BlockObject(i, 0, Material.FLOOR);
                    blockObject.getNbt().put("a", 1);
                    worldObject.setBlock(blockObject);
                }
            }
        }
        worldObject.setBlock(new BlockObject(5, 3, Material.FLOOR));
        worldObject.setBlock(new BlockObject(9, 1, Material.FLOOR));
        worldObject.setBlock(new BlockObject(0, 1, Material.FLOOR));

        //Jsonを生成
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode objectNode = objectMapper.createObjectNode();//メインのJSON
        ArrayNode arrayNode = objectMapper.createArrayNode();//路線を保存する配列

        ObjectNode world_info = objectMapper.createObjectNode();
        world_info.put("width", worldObject.getWidth());
        world_info.put("height", worldObject.getHeight());

        worldObject.getBlocks().forEach(blockObject -> {
            ObjectNode stageJson = objectMapper.createObjectNode();
            stageJson.put("x", blockObject.getX());
            stageJson.put("y", blockObject.getY());
            stageJson.put("type", blockObject.getType().id());

            ObjectNode nbt = objectMapper.createObjectNode();
            for(Map.Entry<String, Object> entry : blockObject.getNbt().entrySet()) {
                if(entry.getValue() instanceof Long value)
                    nbt.put(entry.getKey(), value);
            }

            stageJson.set("nbt", nbt);
            arrayNode.add(stageJson);
        });

        objectNode.set("world_info", world_info);
        objectNode.set("stage", arrayNode);
        return objectNode.toString();
    }

}
