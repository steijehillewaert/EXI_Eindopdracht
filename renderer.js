// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const Readable = require("stream").Readable;
class MyStream extends Readable {
  constructor(opts) {
    super(opts);
  }
  _read() {}
}

process.__defineGetter__("stdin", () => {
  if (process.__stdin) return process.__stdin;
  process.__stdin = new MyStream();
  return process.__stdin;
});

const init = () => {
  const five = require("johnny-five");
  const board = new five.Board();

  board.on("ready", function() {
    const accelerometer = new five.Accelerometer({
      pins: ["A4", "A5"]
    });

    accelerometer.enable();

    if (accelerometer.hasAxis("z")) {
      console.log(accelerometer.z);
    }

    accelerometer.on("change", function() {
      console.log("X: %d", this.x);
      console.log("Y: %d", this.y);
      console.log("Z: %d", this.z);
    });
  });
};

init();
