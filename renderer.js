// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const Readable = require('stream').Readable;
class MyStream extends Readable {
    constructor(opts) {
        super(opts);
    }
    _read() {}
}

process.__defineGetter__('stdin', () => {
    if (process.__stdin) return process.__stdin;
    process.__stdin = new MyStream();
    return process.__stdin;
});


const five = require('johnny-five');
const board = new five.Board();
let accelerometer;

const init = () => {

    board.on("ready", () => {
        const led = new five.Led(13);
        led.blink(500);

        accelerometer = new five.Accelerometer({
            controller: "MPU6050"
        });

        accelerometer.enable();

        console.log(accelerometer);

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
    })
}

init();