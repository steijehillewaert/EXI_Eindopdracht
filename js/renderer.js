// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Arduino = require(`./classes/Arduino.js`);

const init = () => {
  Arduino.setup();

  const five = require("johnny-five");
  const board = new five.Board();

  board.on("ready", function() {
    const accelerometer = new five.Accelerometer({
      controller: "MMA7361",
      pins: ["A0", "A1", "A2"],
      sleepPin: 13,
      autoCalibrate: true
      // override the zeroV values if you know what
      // they are from a previous autoCalibrate
      // zeroV: [4, -8, 0]
    });

    accelerometer.on("change", function() {
      console.log("accelerometer");
      // console.log("  x            : ", Math.round(this.x));
      // console.log("  y            : ", Math.round(this.y));
      // console.log("  z            : ", Math.round(this.z));
      console.log("  links/rechts        : ", Math.round(this.pitch));
      console.log("  Voor/achter         : ", Math.round(this.roll));
      // console.log("  acceleration : ", this.acceleration);
      // console.log("  inclination  : ", this.inclination);
      // console.log("  orientation  : ", this.orientation);
      console.log("--------------------------------------");
    });
  });
};

init();
