// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Arduino = require(`./classes/Arduino.js`);

const THREE = require(`three`);
// const discoball = require(`./classes/Vinyl.js`);
const FBXLoader = require('three-fbx-loader');
const TextureLoader = new THREE.TextureLoader();

const FBX = new FBXLoader();


let scene,
  camera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  HEIGHT,
  WIDTH,
  renderer;

let discoball, recordplayer;

let pitch, roll;

let plaat1;

let hemisphereLight, shadowLight, ambientLight;

const createScene = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();

  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 75;
  nearPlane = 0.1;
  farPlane = 800;

  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  camera.position.set(0, 20, 100);
  camera.rotation.x = -0.1;

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
  hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
  scene.add(hemisphereLight);
};

const handleWindowResize = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
};


const createDiscoball = () => {
  FBX.load('./assets/models/discoball.fbx', object => {
    object.scale.set(0.25, 0.25, 0.25);
    object.position.x = pitch;
    object.position.z = roll;

    // console.log(object);

    discoball = object;
    scene.add(discoball);
  });
};

const createPlayer = () => {
  FBX.load('./assets/models/recordplayer.fbx', object => {
    // console.log(object.children[1].children[5]);

    plaat1 = object.children[1].children[5];

    // const texture = new THREE.TextureLoader().load('./assets/models/tex/september.png');

    console.log(plaat1)

    // console.log(object)

    // plaat1.material.map = texture;

    // console.log(plaat1.material({
    //   map: texture
    // }));



    recordplayer = object;
    recordplayer.castShadow = true;
    recordplayer.receiveShadow = true;
    recordplayer.scale.set(8, 8, 8);
    scene.add(recordplayer);
  });
}

const loop = () => {
  requestAnimationFrame(loop);
  // discoball.rotation.y += 0.005;

  plaat1.rotation.y += 0.005;

  discoball.position.x = pitch;
  discoball.position.z = roll;
  // discoball.rotation.x = pitch;
  // discoball.rotation.z = roll;

  renderer.render(scene, camera);
};

const init = () => {
  Arduino.setup();
  accelerometer();

  createScene();
  createDiscoball();
  createPlayer();
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
      sleepPin: 8,
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

      pitch = Math.floor(Math.round(this.pitch));
      // console.log(pitch);
      roll = Math.floor(Math.round(this.roll));
    });
  });
};

init();