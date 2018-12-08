// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Arduino = require(`./classes/Arduino.js`);



const THREE = require(`three`);
const Discoball = require(`./classes/Discoball.js`);
const FBXLoader = require('three-fbxloader-offical');

const FBX = new FBXLoader();

const fact = document.querySelector(`#fact`);

const clock = new THREE.Clock();

let mixers = [];

const songs = [
  "assets/songs/boogie_wonderland.mp3",
  "assets/songs/disco_inferno.mp3",
  "assets/songs/le_feak.mp3",
  "assets/songs/september.mp3",
  "assets/songs/stayin_alive.mp3"
];

const $audio = document.querySelector(`#audio`);
console.log($audio);

let scene,
  stars,
  camera,
  cubeCamera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  HEIGHT,
  WIDTH,
  renderer;

let recordplayer;

let pitch = 0,
  roll = 0;
let displayedPitch = 0,
  displayedRoll = 0;

let plaat1;

let ambientLight, light, light1, light2, light3, light4, light5, light6, light7;

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

  camera.position.set(0, 20, 90);
  camera.rotation.x = -0.1;

  //cube camera
  cubeCamera = new THREE.CubeCamera(1, 100000, 1024);
  console.log(cubeCamera);
  scene.add(cubeCamera);

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

const createDiscoLights = () => {
  //lights
  ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  light = new THREE.PointLight(0xfffbe3);
  light.position.set(100, 0, -60);
  scene.add(light);

  light1 = new THREE.PointLight(0xfffbe3);
  light1.position.set(-50, 200, 50);
  scene.add(light1);

  //colors
  const intensity = 2.5;
  const distance = 100;
  const decay = 2.0;

  const c1 = 0xff0040,
    c2 = 0x0040ff,
    c3 = 0x80ff80,
    c4 = 0xffaa00,
    c5 = 0x00ffaa,
    c6 = 0xff1100;

  const dot = new THREE.SphereGeometry(0.25, 16, 8);

  light2 = new THREE.PointLight(c1, intensity, distance, decay);
  light2.add(
    new THREE.Mesh(
      dot,
      new THREE.MeshBasicMaterial({
        color: c1
      })
    )
  );
  scene.add(light2);

  light3 = new THREE.PointLight(c2, intensity, distance, decay);
  light3.add(
    new THREE.Mesh(
      dot,
      new THREE.MeshBasicMaterial({
        color: c2
      })
    )
  );
  scene.add(light3);

  light4 = new THREE.PointLight(c3, intensity, distance, decay);
  light4.add(
    new THREE.Mesh(
      dot,
      new THREE.MeshBasicMaterial({
        color: c3
      })
    )
  );
  scene.add(light4);

  light5 = new THREE.PointLight(c4, intensity, distance, decay);
  light5.add(
    new THREE.Mesh(
      dot,
      new THREE.MeshBasicMaterial({
        color: c4
      })
    )
  );
  scene.add(light5);

  light6 = new THREE.PointLight(c5, intensity, distance, decay);
  light6.add(
    new THREE.Mesh(
      dot,
      new THREE.MeshBasicMaterial({
        color: c5
      })
    )
  );
  scene.add(light6);

  light7 = new THREE.PointLight(c6, intensity, distance, decay);
  light7.add(
    new THREE.Mesh(
      dot,
      new THREE.MeshBasicMaterial({
        color: c6
      })
    )
  );
  scene.add(light7);

  //add orbital controls
  //controls = new THREE.OrbitControls(camera);
};

createStars = () => {
  const starGeo = new THREE.SphereGeometry(1000, 100, 50);
  //hoeveelheid sterren
  const starAmt = 10000;
  const starMat = {
    size: 1.0,
    opacity: 0.7
  };
  const starMesh = new THREE.PointsMaterial(starMat);

  for (var i = 0; i < starAmt; i++) {
    var starVertex = new THREE.Vector3();
    starVertex.x = Math.random() * 1000 - 500;
    starVertex.y = Math.random() * 1000 - 500;
    starVertex.z = Math.random() * 1000 - 500;
    starGeo.vertices.push(starVertex);
  }
  stars = new THREE.Points(starGeo, starMesh);
  scene.add(stars);
};

const handleWindowResize = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
};

const createDiscoball = () => {
  scene.add(Discoball.mesh);
};

const createPlayer = () => {
  FBX.load("./assets/models/recordplayer.fbx", object => {
    plaat1 = object.children[1].getObjectByName("Plaat");
    plaat2 = object.children[1].getObjectByName("Plaat_1");

    console.log(object);

    object.mixer = new THREE.AnimationMixer(object);
    mixers.push(object.mixer);

    const action = object.mixer.clipAction(object.animations[0]);

    console.log(action);

    action.play();

    console.log(plaat1);

    new THREE.TextureLoader().load(
      "./assets/models/tex/september2.png",
      texture => {
        window.texture = texture;
        // texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.offset.x = texture.offset.y = -0.5;
        texture.repeat.x = texture.repeat.y = 2;
        plaat1.material.map = texture;
      }
    );

    new THREE.TextureLoader().load(
      "./assets/models/tex/boogie_wonderland.png",
      texture => {
        plaat2.material.map = texture;
      }
    );

    // texture.offset.x = .1;
    //texture.offset.y = ;

    recordplayer = object;

    recordplayer.castShadow = true;
    recordplayer.receiveShadow = true;

    recordplayer.scale.set(8, 8, 8);
    scene.add(recordplayer);
  });
};

const loop = () => {
  requestAnimationFrame(loop);

  if (mixers.length > 0) {
    for (let i = 0; i < mixers.length; i++) {
      mixers[i].update(clock.getDelta());
    }
  }

  if (!plaat1) {
    return;
  }

  plaat1.rotation.y += 0.005;

  stars.rotation.y += 0.0005;

  displayedPitch += (pitch - displayedPitch) * 0.1;
  displayedRoll += (roll - displayedRoll) * 0.1;

  Discoball.mesh.position.x = THREE.Math.mapLinear(
    displayedPitch,
    -20,
    20,
    -20,
    10
  );
  Discoball.mesh.position.z = THREE.Math.mapLinear(
    displayedRoll,
    20,
    -20,
    65,
    45
  );

  Discoball.mesh.rotation.x = displayedPitch;

  console.log(Discoball.mesh.position.x);

  //move dico lights -> PARTYYYY
  const time = Date.now() * 0.0025;
  const d = 100;
  light2.position.x = Math.cos(time * 0.3) * d;
  light2.position.y = Math.cos(time * 0.1) * d;
  light2.position.z = Math.sin(time * 0.7) * d;

  light3.position.x = Math.sin(time * 0.5) * d;
  light3.position.y = Math.cos(time * 0.1) * d;
  light3.position.z = Math.sin(time * 0.5) * d;

  light4.position.x = Math.sin(time * 0.3) * d;
  light4.position.y = Math.sin(time * 0.1) * d;
  light4.position.z = Math.sin(time * 0.5) * d;

  light5.position.x = Math.cos(time * 0.3) * d;
  light5.position.y = Math.cos(time * 0.1) * d;
  light5.position.z = Math.sin(time * 0.5) * d;

  light6.position.x = Math.cos(time * 0.5) * d;
  light6.position.y = Math.sin(time * 0.3) * d;
  light6.position.z = Math.cos(time * 0.5) * d;

  light7.position.x = Math.cos(time * 0.5) * d;
  light7.position.y = Math.sin(time * 0.1) * d;
  light7.position.z = Math.cos(time * 0.5) * d;

  //Update the render target cube
  Discoball.visible = false;
  cubeCamera.position.copy(Discoball.mesh.position);
  cubeCamera.updateCubeMap(renderer, scene);

  Discoball.visible = true;
  renderer.render(scene, camera);
};

const createFacts = songs => {
  const geometry = new THREE.BoxGeometry(100, 20, 5);
  const material = new THREE.MeshBasicMaterial({
    color: "maroon"
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.y = 60;

  console.log(cube);
  scene.add(cube);

  console.log(songs.songs[0].facts[0]);
  // fact.textContent = songs.songs[0].facts[0].fact01;
};

const parse = songs => {
  createFacts(songs);
  console.log(songs);
};

const init = () => {
  Arduino.setup();
  accelerometer();

  $audio.src = songs[1];

  const data = `assets/json/data.json`;
  fetch(data)
    .then(r => r.json())
    .then(parse);

  createScene();
  createDiscoball();
  createPlayer();
  createDiscoLights();
  createStars();
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
      console.log("  links/rechts        : ", Math.round(this.pitch));
      console.log("  Voor/achter         : ", Math.round(this.roll));
      // console.log("  acceleration : ", this.acceleration);
      // console.log("  inclination  : ", this.inclination);
      // console.log("  orientation  : ", this.orientation);
      // console.log("--------------------------------------");

      pitch = this.pitch;
      roll = this.roll;
    });
  });
};

init();