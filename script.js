function updateFieldIfNotNull(fieldName, value, precision = 10) {
  if (value != null)
    document.getElementById(fieldName).innerHTML = value.toFixed(precision);
}

function handleMotion(event) {
  const accelerationX = event.acceleration.x;
  const accelerationY = event.acceleration.y;

  updateFieldIfNotNull("Accelerometer_x", accelerationX);
  updateFieldIfNotNull("Accelerometer_y", accelerationY);

  const object = document.getElementById("object");
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Map accelerometer values to screen coordinates
  const newX = (accelerationX / 10) * (screenWidth / 2) + screenWidth / 2;
  const newY = (accelerationY / 10) * (screenHeight / 2) + screenHeight / 2;

  // Set object position
  object.style.left = `${newX}px`;
  object.style.top = `${newY}px`;
}

let demo_button = document.getElementById("start_demo");
demo_button.onclick = function (e) {
  e.preventDefault();

  // Request permission for iOS 13+ devices
  if (
    DeviceMotionEvent &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    DeviceMotionEvent.requestPermission();
  }

  window.addEventListener("devicemotion", handleMotion);
};
