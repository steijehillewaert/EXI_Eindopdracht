// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Arduino = require(`./classes/Arduino.js`);

const THREE = require(`three`);
// const discoball = require(`./classes/Vinyl.js`);
const FBXLoader = require('three-fbx-loader');


let scene,
  camera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  HEIGHT,
  WIDTH,
  renderer;

let discoball;

let pitch, roll;

let hemisphereLight, shadowLight, ambientLight;

const createScene = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();

  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 75;
  nearPlane = 0.1;
  farPlane = 1000;

  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  camera.position.set(0, 20, 100);

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.shadowMap.enabled = true;

  renderer.setSize(WIDTH, HEIGHT);
  document.getElementById(`world`).appendChild(renderer.domElement);

  window.addEventListener(`resize`, handleWindowResize, false);
  window.scene = scene;
};

const createLights = () => {
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
  shadowLight = new THREE.DirectionalLight(0xffffff, 0.2);
  ambientLight = new THREE.AmbientLight(0xdc8874, 0.9);

  scene.add(hemisphereLight);
  scene.add(shadowLight);
  scene.add(ambientLight);
};

const handleWindowResize = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
};


const createDiscoball = () => {

  const FBX = new FBXLoader();
  FBX.load('./assets/models/discoball.fbx', object => {
    object.scale.set(0.25, 0.25, 0.25);
    object.position.x = pitch;
    object.position.z = roll;

    discoball = object;
    scene.add(discoball);
  });
};

const loop = () => {
  requestAnimationFrame(loop);
  discoball.rotation.y += 0.005;
  renderer.render(scene, camera);
};

const init = () => {
  Arduino.setup();
  accelerometer();

  createScene();
  createDiscoball();
  createLights();
  loop();
};

const accelerometer = () => {
  const five = require("johnny-five");
  const board = new five.Board();

  board.on("ready", function () {
    const accelerometer = new five.Accelerometer({
      controller: "MMA7361",
      pins: ["A0", "A1", "A2"],
      sleepPin: 13,
      autoCalibrate: true
      // override the zeroV values if you know what
      // they are from a previous autoCalibrate
      // zeroV: [4, -8, 0]
    });

    accelerometer.on("change", function () {
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

      pitch = Math.round(this.pitch);
      roll = Math.round(this.roll);
    });
  });
};

init();