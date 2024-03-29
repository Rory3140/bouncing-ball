import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
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
const ball = document.getElementById("ball");
const scoreDisplay = document.getElementById("score");
const stopButton = document.getElementById("stop");
const container = document.getElementById("container");
const qrCode = document.getElementById("qr-code");
const scoreInfo = document.getElementById("score-info");
const hidden = document.getElementById("hidden");
const speedValue = document.getElementById("speed-value");
const speedSlider = document.getElementById("speed-slider");
const startButton = document.getElementById("start");

// Set initial values
let screenWidth = window.innerWidth;
let isActive = false;
let deviceLinked = false;
let animationFrameId = null;
let score = null;
let session = null;
session = "12345";

function generateRandomString(length) {
  // Define the characters that can be in the string
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    // Generate a random index to pick a character from the characters string
    const randomIndex = Math.floor(Math.random() * characters.length);
    // Append the character to the result
    result += characters[randomIndex];
  }

  return result;
}
session = generateRandomString(5);

// Generate QR code for the controller
new QRCode(qrCode, {
  text:
    "https://rory3140.github.io/bouncing-ball/controller.html?session=" +
    session,
  width: 128,
  height: 128,
  colorDark: "#ffffff",
  colorLight: "#6962AD",
  correctLevel: QRCode.CorrectLevel.H,
});

// Set the initial speed value
const initialSpeed = 5;
let moveSpeed = 5 * 2.5;
speedValue.textContent = initialSpeed;

// Update the speed value when the speed slider is moved
speedSlider.addEventListener("input", function () {
  moveSpeed = speedSlider.value * 2.5;
  speedValue.textContent = speedSlider.value;
});

// Start button event listener
startButton.addEventListener("click", function (e) {
  e.preventDefault();
  isActive = !isActive;
  score = 0;
  updateScore();
  container.style.display = "none";
  stopButton.style.display = "block";
  ball.style.display = "block";

  // Cancel any existing animation frame and start the ball animation
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
  startBallAnimation();
});

// Stop button event listener
stopButton.addEventListener("click", function (e) {
  e.preventDefault();
  isActive = !isActive;
  container.style.display = "flex";
  stopButton.style.display = "none";
  ball.style.display = "none";
  centerPaddle();

  // Cancel the animation frame
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
});

// Update the score display
function updateScore() {
  scoreDisplay.textContent = score;
  if (score !== null) {
    scoreInfo.textContent = "Score: " + score;
    scoreInfo.style.display = "block";
  }
}
updateScore();

// Start listening to device orientation events
const dbRef = ref(database, session);
onValue(dbRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    if (!deviceLinked) {
      deviceLinked = true;
      qrCode.style.display = "none";
      hidden.style.display = "block";
    }
    handleOrientation(data.orientation);
  }
});

// Handle device orientation
function handleOrientation(gamma) {
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

// Ball animation variables
let ballSpeedY = 2;
let ballSpeedX = 2;
let ballPositionX = 0;
let ballPositionY = 0;

// Start the ball animation
function startBallAnimation() {
  // Re-set initial ball speed
  ballSpeedY = 2;

  // Reset ball position
  ballPositionX = screenWidth / 2;
  ballPositionY = 40;

  // Update ball position
  ball.style.top = `${ballPositionY}px`;
  ball.style.left = `${ballPositionX}px`;

  // Start ball animation loop
  animationFrameId = requestAnimationFrame(moveBall);
}

// Move the ball
function moveBall() {
  ballPositionY += ballSpeedY;
  ballPositionX += ballSpeedX;

  // Check for collisions with paddle
  const paddleRect = paddle.getBoundingClientRect();
  const ballRect = ball.getBoundingClientRect();
  if (
    ballRect.left < paddleRect.right &&
    ballRect.right > paddleRect.left &&
    ballRect.top < paddleRect.bottom &&
    ballRect.bottom > paddleRect.top
  ) {
    // Determine collision side and adjust horizontal direction
    const hitPoint = ballRect.left + ballRect.width / 2;
    const paddleMidPoint = paddleRect.left + paddleRect.width / 2;
    if (hitPoint < paddleMidPoint) {
      // Hit the left side of the paddle
      ballSpeedX = Math.abs(ballSpeedX) * -1;
    } else {
      // Hit the right side of the paddle
      ballSpeedX = Math.abs(ballSpeedX);
    }

    if (ballSpeedY > 0) {
      // Ball is moving downwards
      ballPositionY = paddleRect.top - ballRect.height - 1;
    } else {
      // Ball is moving upwards
      ballPositionY = paddleRect.bottom + 1;
    }

    // Update score
    score++;
    updateScore();

    // Reverse vertical direction and increase speed slightly
    ballSpeedY *= -1.05;
  }

  // Check for collisions with window edges
  if (
    ballPositionX <= 0 ||
    ballPositionX >= window.innerWidth - ball.offsetWidth - 1
  ) {
    ballSpeedX *= -1; // Reverse horizontal direction
  }
  if (ballPositionY <= 40) {
    ballSpeedY = Math.abs(ballSpeedY);
  } else if (ballPositionY >= window.innerHeight - ball.offsetHeight - 1) {
    // Game over
    stopButton.click();
    return;
  }

  // Update ball position
  ball.style.top = `${ballPositionY}px`;
  ball.style.left = `${ballPositionX}px`;

  // Continue the animation loop
  animationFrameId = requestAnimationFrame(moveBall);
}

// Center the paddle on the screen
function centerPaddle() {
  paddle.style.display = "block";
  const initialLeft = (screenWidth - paddle.offsetWidth) / 2;
  paddle.style.left = `${initialLeft}px`;
}

// Update the screen width when the window is resized and re-center the paddle
window.addEventListener("resize", () => {
  screenWidth = window.innerWidth;
  centerPaddle();
});
centerPaddle();
