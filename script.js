if ("DeviceOrientationEvent" in window) {
  const display = document.getElementById("display");

  window.addEventListener("deviceorientation", handleOrientation);

  function handleOrientation(event) {
    const x = event.alpha;
    const y = event.beta;
    const z = event.gamma;

    display.innerText = `X: ${x}\nY: ${y}\nZ: ${z}`;
    console.log(x, y, z);
  }
} else {
  alert("Device orientation not supported.");
}
