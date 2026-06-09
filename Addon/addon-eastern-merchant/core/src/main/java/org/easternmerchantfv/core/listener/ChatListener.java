package org.easternmerchantfv.core.listener;

import net.labymod.api.Laby;
import net.labymod.api.client.network.server.ServerData;
import net.labymod.api.client.chat.ChatMessage;
import net.labymod.api.client.chat.ChatTrustLevel;
import net.labymod.api.event.Subscribe;
import org.easternmerchantfv.core.EasternMerchantFvAddon;
import net.labymod.api.event.client.chat.ChatReceiveEvent;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Locale;

import com.google.gson.JsonObject;

public class ChatListener {

  private static final String TARGET_SERVER_HOST_DK = "mc.freakyville.dk";
  private static final String TARGET_SERVER_HOST_NET = "mc.freakyville.net";
  private static final String API_ENDPOINT = "http://localhost:3000/api/members";
  private static final String START_MARKER = "-={";
  private static final String END_MARKER = "Medlemmer:";

  private final EasternMerchantFvAddon addon;

  private boolean capturing = false;
  private final StringBuilder capturedBlock = new StringBuilder();

  private final HttpClient httpClient = HttpClient.newHttpClient();

  private boolean isOnFreakyVille() {
    ServerData server = Laby.labyAPI().serverController().getCurrentServerData();

    if (server == null) {
      return false;
    }

    if (server.address() == null || server.address().getHost() == null) {
      return false;
    }

    String host = server.address().getHost().toLowerCase(Locale.ROOT);
    return host.equals(TARGET_SERVER_HOST_DK) || host.equals(TARGET_SERVER_HOST_NET);
  }

  public ChatListener(EasternMerchantFvAddon addon) {
    this.addon = addon;
  }

  private void sendToServer(String data) {
    if (data == null || data.isBlank()) {
      addon.logger().warn("Skipped sending empty member block");
      return;
    }

    JsonObject jsonObject = new JsonObject();
    jsonObject.addProperty("cell", data);

    String json = jsonObject.toString();

    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(API_ENDPOINT))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(json))
        .build();

    httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
        .thenAccept(response ->
            addon.logger().info("Server responded with " + response.statusCode())
        )
        .exceptionally(error -> {
            addon.logger().error("Failed to send data", error);
            return null;
        });
  }

  private void appendLine(String msg) {
    if (capturedBlock.length() > 0) {
      capturedBlock.append(System.lineSeparator());
    }
    capturedBlock.append(msg);
  }

  private void resetCapture() {
    capturing = false;
    capturedBlock.setLength(0);
  }

  private boolean isServerSystemMessage(ChatMessage chatMessage) {
    return chatMessage.trustLevel() == ChatTrustLevel.SYSTEM
        && chatMessage.getSenderUniqueId() == null;
  }

  private boolean hasNamePrefixBeforeMarker(String msg, String marker) {
    int markerIndex = msg.indexOf(marker);
    if (markerIndex <= 0) {
      return false;
    }

    String beforeMarker = msg.substring(0, markerIndex);
    return beforeMarker.contains(":");
  }

  @Subscribe
  public void onChatMessage(ChatReceiveEvent event) {
    ChatMessage chatMessage = event.chatMessage();
    String msg = chatMessage.getPlainText();

    if (msg == null || msg.isBlank()) {
      return;
    }

    if (!isOnFreakyVille()) {
      resetCapture();
      return;
    }

    // START marker
    if (msg.contains(START_MARKER)
      && isServerSystemMessage(chatMessage)
      && !hasNamePrefixBeforeMarker(msg, START_MARKER)) {
      capturing = true;
      addon.logger().info("Started capturing chat block");
      capturedBlock.setLength(0);
      appendLine(msg);
      return;
    }

    // END marker
    if (capturing
      && msg.contains(END_MARKER)
      && !hasNamePrefixBeforeMarker(msg, END_MARKER)) {
      appendLine(msg);
      String payload = capturedBlock.toString().trim();
      addon.logger().info("Captured block:\n" + payload);
      addon.logger().info("Stopped capturing chat block");
      sendToServer(payload);
      resetCapture();
      return;
    }

    // Only log while active
    if (capturing) {
      appendLine(msg);
    }
  }
}