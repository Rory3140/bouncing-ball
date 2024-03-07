const WebSocket = require("ws");
const ws = new WebSocket("ws://localhost:8080");

// Event listener for connection open
ws.addEventListener("open", function (event) {
  console.log("Connected to WebSocket server");
});

// Event listener for messages received
ws.addEventListener("message", function (event) {
  console.log("Received message:", event.data);
});

// Send a test message to the server
ws.send("Hello, server!");
