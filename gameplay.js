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
const info = document.getElementById("info");
const scoreInfo = document.getElementById("score-info");
const startButton = document.getElementById("start");
const speedValue = document.getElementById("speed-value");
const slider = document.getElementById("slider");

// Set initial values
let screenWidth = window.innerWidth;
let isActive = false;
let animationFrameId = null;
let score = null;

// Set the initial speed value
let moveSpeed = slider.value;
speedValue.textContent = moveSpeed - 0.5;

// Update the speed value when the slider is moved
slider.addEventListener("input", function () {
  moveSpeed = slider.value * 2.5;
  speedValue.textContent = slider.value;
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
    info.style.display = "none";
    scoreInfo.textContent = "Score: " + score;
    scoreInfo.style.display = "block";
  }
}
updateScore();

// Start listening to device orientation events
const dbRef = ref(database, "orientationData");
onValue(dbRef, (snapshot) => {
  if (!isActive) return;
  const data = snapshot.val();
  handleOrientation(data.orientation);
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
  const initialLeft = (screenWidth - paddle.offsetWidth) / 2;
  paddle.style.left = `${initialLeft}px`;
}

// Update the screen width when the window is resized and re-center the paddle
window.addEventListener("resize", () => {
  screenWidth = window.innerWidth;
  centerPaddle();
});
centerPaddle();
