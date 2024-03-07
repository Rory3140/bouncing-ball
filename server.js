const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(data) {
    // Broadcast received data to all connected clients
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});
