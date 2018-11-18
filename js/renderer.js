// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Arduino = require(`./classes/Arduino.js`)


const init = () => {

    Arduino.setup()

    const five = require("johnny-five");
    const board = new five.Board();

    board.on("ready", function () {
        const accelerometer = new five.Accelerometer({
            controller: "ANALOG",
            pins: ["A4", "A5"]
        });

        accelerometer.on("change", function () {
            console.log("accelerometer");
            console.log("  x            : ", this.x);
            console.log("  y            : ", this.y);
            console.log("  z            : ", this.z);
            console.log("  pitch        : ", this.pitch);
            console.log("  roll         : ", this.roll);
            console.log("  acceleration : ", this.acceleration);
            console.log("  inclination  : ", this.inclination);
            console.log("  orientation  : ", this.orientation);
            console.log("--------------------------------------");
        });

    });
};

init();