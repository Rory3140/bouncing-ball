const display = document.getElementById("display");
display.innerText = "JS Linked";

let is_running = false;
let demo_button = document.getElementById("start");
demo_button.onclick = function (e) {
  e.preventDefault();

  // Request permission for iOS 13+ devices
  if (
    DeviceMotionEvent &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    DeviceMotionEvent.requestPermission();
  }

  if (is_running) {
    window.removeEventListener("devicemotion", handleMotion);
    demo_button.innerHTML = "Start demo";
    is_running = false;
  } else {
    window.addEventListener("devicemotion", handleMotion);
    document.getElementById("start_demo").innerHTML = "Stop demo";
    is_running = true;
  }
};

let ax, ay, az;
function handleMotion(evt) {
  // Access Accelerometer Data
  ax = evt.accelerationIncludingGravity.x;
  ay = evt.accelerationIncludingGravity.y;
  az = evt.accelerationIncludingGravity.z;

  display.innerText = `X: ${ax}\nY: ${ay}\nZ: ${az}`;
  console.log(x, y, z);
}
