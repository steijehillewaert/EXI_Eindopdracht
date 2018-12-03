// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Arduino = require(`./classes/Arduino.js`);

const THREE = require(`three`);
// const kaas = require(`./classes/Discoball.js`);
const FBXLoader = require("three-fbx-loader");
const TextureLoader = new THREE.TextureLoader();

const FBX = new FBXLoader();

const clock = new THREE.Clock();

let scene,
  camera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  HEIGHT,
  WIDTH,
  renderer;

let mixer;

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
  renderer.gammaInput = true;
  renderer.gammaOutput = true;

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
  FBX.load("./assets/models/discoball.fbx", object => {
    object.scale.set(0.25, 0.25, 0.25);
    object.position.x = pitch;
    object.position.z = roll;

    // console.log(object);

    discoball = object;

    // discoball.material.shininess = 100;
    // console.log(discoball.material.shininess);
    scene.add(discoball);
  });
};

const createPlayer = () => {
  FBX.load("./assets/models/recordplayer.fbx", object => {
    console.log(object);
    plaat1 = object.children[1].children[8];

    const texture = new THREE.TextureLoader().load(
      "./assets/models/tex/september2.png"
    );

    plaat1.material.map = texture;

    recordplayer = object;

    recordplayer.castShadow = true;
    recordplayer.receiveShadow = true;

    recordplayer.scale.set(8, 8, 8);
    scene.add(recordplayer);

    mixer = new THREE.AnimationMixer(recordplayer);
    mixer.clipAction(object.animations[0]).play();
  });
};

const loop = () => {
  requestAnimationFrame(loop);

  plaat1.rotation.y += 0.005;

  discoball.position.x = 0;
  discoball.position.z = 0;

  // discoball.position.x = pitch;
  // discoball.position.z = roll;
  // discoball.rotation.x = pitch;
  // discoball.rotation.z = roll;

  const delta = clock.getDelta();
  mixer.update(delta);

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
      pins: ["A5", "A4", "A3"],
      sleepPin: 13,
      autoCalibrate: true
      // override the zeroV values if you know what
      // they are from a previous autoCalibrate
      // zeroV: [4, -8, 0]
    });

    accelerometer.on("change", function () {
      // console.log("accelerometer");
      // console.log("  x            : ", Math.round(this.x));
      // console.log("  y            : ", Math.round(this.y));
      // console.log("  z            : ", Math.round(this.z));
      // console.log("  links/rechts        : ", Math.round(this.pitch));
      // console.log("  Voor/achter         : ", Math.round(this.roll));
      // console.log("  acceleration : ", this.acceleration);
      // console.log("  inclination  : ", this.inclination);
      // console.log("  orientation  : ", this.orientation);
      // console.log("--------------------------------------");

      pitch = Math.floor(Math.round(this.pitch));
      // console.log(pitch);
      roll = Math.floor(Math.round(this.roll));
    });
  });
};

init();