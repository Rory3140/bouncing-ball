let gyroscope = new Gyroscope({ frequency: 60 });
const display = document.getElementById("display");

gyroscope.addEventListener("reading", (e) => {
    display.innerText = `X: ${gyroscope.x}\nY: ${gyroscope.y}\nZ: ${gyroscope.z}`;
    console.log(gyroscope.x, gyroscope.y, gyroscope.z);
});

gyroscope.start();
