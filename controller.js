import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHvwXIji75oFVqTHqTSTXN4Mrw_8Cqtg8",
  authDomain: "bouncing-ball-rw.firebaseapp.com",
  databaseURL: "https://bouncing-ball-rw-default-rtdb.firebaseio.com",
  projectId: "bouncing-ball-rw",
  storageBucket: "bouncing-ball-rw.appspot.com",
  messagingSenderId: "353355833704",
  appId: "1:353355833704:web:afcd68b1b8ab1fc9d3b6dd",
  measurementId: "G-4DN6DJKY30",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Get elements from the DOM
const paddle = document.getElementById("paddle");
const startButton = document.getElementById("start");

// Set initial values
let screenWidth = window.innerWidth;
let isActive = false;
const moveSpeed = 5;

function handleOrientation(event) {
  if (!isActive) return;

  const gamma = event.gamma;

  // Send data to the Firebase Realtime Database
  set(ref(database, "orientationData"), {
    orientation: gamma,
  });

  // Determine movement direction based on gamma value
  let direction = gamma > 5 ? 1 : gamma < -5 ? -1 : 0;

  // Update paddle's position at a constant speed
  const currentLeft = parseInt(paddle.style.left, 10);
  let newLeft = currentLeft + moveSpeed * direction;

  // Ensure the paddle remains within screen bounds
  newLeft = Math.max(0, Math.min(screenWidth - paddle.offsetWidth, newLeft));

  // Update paddle's position
  paddle.style.left = `${newLeft}px`;
}

// Start listening for device orientation
function startListening() {
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response == "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
        }
      })
      .catch(console.error);
  } else {
    window.addEventListener("deviceorientation", handleOrientation);
  }
}

// Stop listening for device orientation
function stopListening() {
  window.removeEventListener("deviceorientation", handleOrientation);
}

// Start/stop  button event listener
startButton.addEventListener("click", function (e) {
  e.preventDefault();
  isActive = !isActive;

  if (isActive) {
    startButton.textContent = "Stop";
    startListening();
  } else {
    startButton.textContent = "Start";
    stopListening();
    centerPaddle();
  }
});

// Center the paddle on the screen
function centerPaddle() {
  const initialLeft = (screenWidth - paddle.offsetWidth) / 2;
  paddle.style.left = `${initialLeft}px`;
}

// Update the screen width when the window is resized and re-center the paddle
window.addEventListener("resize", () => {
  screenWidth = window.innerWidth;
  centerPaddle();
});
centerPaddle();
