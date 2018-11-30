// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Arduino = require(`./classes/Arduino.js`);

const init = () => {
  Arduino.setup();

  const five = require("johnny-five");
  const board = new five.Board();

  board.on("ready", function() {
    // Create an MMA7361 Accelerometer object:
    //
    // - attach Xo, Yo, and Zo to A0, A1, A2
    // - specify the MMA7361 controller
    // - optionally, specify the sleepPin
    // - optionally, set it to auto-calibrate
    // - optionally, set the zeroV values.
    //    This can be done when retrieving them
    //    after an autoCalibrate
    var accelerometer = new five.Accelerometer({
      controller: "MMA7361",
      pins: ["A0", "A1", "A2"],
      sleepPin: 13,
      autoCalibrate: true,
      // override the zeroV values if you know what
      // they are from a previous autoCalibrate
      zeroV: [320, 365, 295]
    });

    accelerometer.on("change", function() {
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
