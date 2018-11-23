// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Arduino = require(`./classes/Arduino.js`);


const init = () => {

    Arduino.setup();

    const SerialPort = require('serialport');
    const port = new SerialPort('/dev/cu.usbmodem14101', {
        autoOpen: false
    });

    port.open(function (err) {
        if (err) {
            return console.log('Error opening port: ', err.message);
        }

        // Because there's no callback to write, write errors will be emitted on the port:
        port.write('main screen turn on');
    });

    // The open event is always emitted
    port.on('open', function () {
        // open logic
    });

    // Switches the port into "flowing mode"
    port.on('data', function (data) {
        console.log('Data:', data);
    });

    // Read data that is available but keep the stream from entering "flowing mode"
    port.on('readable', function () {
        console.log('Data:', port.read());
    });



    // const five = require("johnny-five");
    // const board = new five.Board();

    // board.on("ready", function () {
    //     const accelerometer = new five.Accelerometer({
    //         controller: "ANALOG",
    //         pins: ["A4", "A5"]
    //     });

    //     accelerometer.on("change", function () {
    //         console.log("accelerometer");
    //         console.log("  x            : ", this.x);
    //         console.log("  y            : ", this.y);
    //         console.log("  z            : ", this.z);
    //         console.log("  pitch        : ", this.pitch);
    //         console.log("  roll         : ", this.roll);
    //         console.log("  acceleration : ", this.acceleration);
    //         console.log("  inclination  : ", this.inclination);
    //         console.log("  orientation  : ", this.orientation);
    //         console.log("--------------------------------------");
    //     });

    // });
};

init();