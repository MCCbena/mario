package xyz.jbcp.mario.stage;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.annotation.Nullable;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import xyz.jbcp.mario.stage.worlds.one_one;

import java.io.IOException;
import java.util.Map;

public class SocketController extends TextWebSocketHandler {
    @Override
    public void afterConnectionEstablished(@Nullable WebSocketSession session) {
        System.out.println("WebSocketの接続が確立しました。");
    }
    /**
     * メッセージの送受信
     */
    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) {
        System.out.println("メッセージ受信:" + message.getPayload());
        String responseJson;
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
    public void afterConnectionClosed(@Nullable WebSocketSession session, @Nullable CloseStatus status) {
        System.out.println("WebSocketの接続が終了しました。");
    }

    private String getStage(String number) {
        WorldObject worldObject;
        switch (number){
            case "1-1"-> worldObject = one_one.get();
            default -> worldObject = new WorldObject(2000, 2000);
        }

        //Jsonを生成
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode mainJson = objectMapper.createObjectNode();//メインのJSON

        //jsonの初期設定
        ObjectNode world_info = objectMapper.createObjectNode();
        world_info.put("width", worldObject.getWidth());
        world_info.put("height", worldObject.getHeight());
        mainJson.set("world_info", world_info);

        //ブロックをjsonに保存
        ArrayNode BlockSaveArrayNode = objectMapper.createArrayNode();//ブロックを保存する配列
        worldObject.getBlocks().forEach(blockObject -> {
            if(blockObject.getType().id() != 0) {
                ObjectNode stageJson = objectMapper.createObjectNode();
                stageJson.put("type", blockObject.getType().id());
                stageJson.put("x", blockObject.getX());
                stageJson.put("y", blockObject.getY());

                //nbtデータを作成して、jsonに代入
                ObjectNode nbt = objectMapper.createObjectNode();
                for (Map.Entry<String, Object> entry : blockObject.getNbt().entrySet()) {
                    putJson(nbt, entry.getKey(), entry.getValue());
                }

                stageJson.set("nbt", nbt);
                BlockSaveArrayNode.add(stageJson);
            }
        });

        //メインJsonに代入
        mainJson.set("stage", BlockSaveArrayNode);

        //エンティティをjsonに保存
        ArrayNode EntitySaveArrayNode = objectMapper.createArrayNode();
        worldObject.getEntities().forEach(entityObject -> {
            ObjectNode entityJson = objectMapper.createObjectNode();
            entityJson.put("type", entityObject.getType().id());
            entityJson.put("x", entityObject.getX());
            entityJson.put("y", entityObject.getY());

            //nbtデータの作成
            ObjectNode nbt = objectMapper.createObjectNode();
            for (Map.Entry<String, Object> entry : entityObject.getNbt().entrySet()) {
                putJson(nbt, entry.getKey(), entry.getValue());
            }
            entityJson.set("nbt", nbt);
            EntitySaveArrayNode.add(entityJson);
        });
        //メインjsonに代入
        mainJson.set("entities", EntitySaveArrayNode);

        return mainJson.toString();
    }

    //valueを型に変換してobjectNodeに代入します。
    private void putJson(ObjectNode objectNode, String key, Object value) {
        if (value instanceof Integer temp){
            objectNode.put(key, temp);
            return;
        }
        if (value instanceof Double temp){
            objectNode.put(key, temp);
            return;
        }
        if (value instanceof Boolean temp){
            objectNode.put(key, temp);
            return;
        }
        if (value instanceof String temp)
            objectNode.put(key, temp);
        else objectNode.put(key, value.toString());
    }

}
