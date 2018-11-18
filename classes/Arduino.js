const Readable = require("stream").Readable;

class Arduino {

    setup() {
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

        console.log("ARDUINO LIVE");
    }
}

module.exports = new Arduino();