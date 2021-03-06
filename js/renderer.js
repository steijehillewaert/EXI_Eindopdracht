// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Arduino = require(`./classes/Arduino.js`);

const THREE = require(`three`);
const Discoball = require(`./classes/Discoball.js`);
const Stars = require(`./classes/Stars.js`);
const FBXLoader = require("three-fbxloader-offical");
const Tuna = require("tunajs");

const $loadingscreen = document.querySelector(`.loading-screen`);

const FBX = new FBXLoader();

const fact = document.querySelector(`#fact`);
const songInfo = document.querySelector(`#song-info`);

const clock = new THREE.Clock();

let rate;

let mixers = [];

let action;

let audioEffect;

let scene,
  camera,
  cubeCamera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  HEIGHT,
  WIDTH,
  renderer,
  plaat,
  recordplayer,
  data;

let pitch = 0,
  roll = 0;

let displayedPitch = 0,
  displayedRoll = 0;

let previousFrameBalanceBoardCentered = false;

let ambientLight, light, light1, light2, light3, light4, light5, light6, light7;

let currentSong = 0;
let currentFact = 0;
let maxCurrentFact;

let wachttijdSong = true;
let loadingScreenTimeoutId = false;
let timerNextFact;

const resetWachttijdSong = () => {
  wachttijdSong = true;
};

const setWachttijdSong = () => {
  wachttijdSong = false;
  window.setTimeout(resetWachttijdSong, 2000);
};

const resetTimeoutLoadingScreen = () => {
  window.clearTimeout(loadingScreenTimeoutId);
  loadingScreenTimeoutId = window.setTimeout(goToLoadingScreen, 10000);
};

const goToLoadingScreen = () => {
  console.log("go to loading screen");
  $loadingscreen.classList.remove(`hide`);
  audioEffect.bypass = true;
};

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
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
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
};

createStars = () => {
  scene.add(Stars.mesh);
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
  FBX.load("./assets/models/recordplayer2.fbx", object => {
    console.log(object);

    plaat = object.children[1].getObjectByName("PLAAT");
    basis = object.children[1].children[3].getObjectByName("Basis");

    basis.material.color.r = 1 / 255;
    basis.material.color.g = 1 / 255;
    basis.material.color.b = 1 / 255;
    // basis.material.color("red");

    object.mixer = new THREE.AnimationMixer(object);
    mixers.push(object.mixer);

    action = object.mixer.clipAction(object.animations[0]);

    recordplayer = object;

    recordplayer.castShadow = true;
    recordplayer.receiveShadow = true;

    recordplayer.scale.set(8, 8, 8);
    scene.add(recordplayer);
  });
};

const loop = () => {
  requestAnimationFrame(loop);

  console.log(`😡: ${displayedPitch}`);

  const time = Date.now() * 0.0025;

  rate = THREE.Math.mapLinear(displayedRoll, 11, -9, 1, 8);

  // console.log(rate);

  // console.log(displayedRoll);

  if (mixers.length > 0) {
    for (let i = 0; i < mixers.length; i++) {
      mixers[i].update(clock.getDelta());
    }
  }

  if (!plaat) {
    return;
  }

  if (!audioEffect) {
    return;
  }

  audioEffect.bypass = true;

  plaat.rotation.y += 0.005;

  Stars.mesh.rotation.y += 0.0005;

  displayedPitch += (pitch - displayedPitch) * 0.1;
  displayedRoll += (roll - displayedRoll) * 0.1;

  // Discoball.mesh.position.x = -25;
  Discoball.mesh.position.x =
    THREE.Math.mapLinear(displayedPitch, 20, -6, -25, 55) - 35;
  Discoball.mesh.position.z = THREE.Math.mapLinear(
    displayedRoll,
    -20,
    20,
    65,
    45
  );

  Discoball.mesh.rotation.x = displayedPitch;

  const isBalanceBoardCentered = getBalanceBoardIsCentered(
    displayedPitch,
    displayedRoll
  );
  console.log("isBalanceBoardCentered:", isBalanceBoardCentered);
  if (!isBalanceBoardCentered) {
    console.log(displayedPitch, displayedRoll);
    // reset timer
    resetTimeoutLoadingScreen();
    $loadingscreen.classList.add(`hide`);
    audioEffect.bypass = false;
  }

  checknextSong();
  checkPrevSong();
  addLights(time);
  renderer.render(scene, camera);

  previousFrameBalanceBoardCentered = isBalanceBoardCentered;
};

const getBalanceBoardIsCentered = (displayedPitch, displayedRoll) => {
  return Math.abs(displayedPitch) <= 1.8 && Math.abs(displayedRoll) <= 1.8;
};

const hideLoadingScreen = (displayedPitch, displayedRoll) => {
  if (displayedPitch >= 2 || displayedRoll >= 2) {
    $loadingscreen.classList.add(`hide`);
    audioEffect.bypass = false;
    console.log(audioEffect.bypass);
  }
};

const addLights = time => {
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
};

const checknextSong = () => {
  if (displayedPitch >= 9 && wachttijdSong) {
    console.log(`😡: ${displayedPitch}`);
    nextSong();
    //animateDiscobal();
    setWachttijdSong();
    console.log(wachttijdSong);
  }
};

const checkPrevSong = () => {
  if (displayedPitch <= -5.5 && wachttijdSong) {
    previousSong();
    //animateDiscobal();
    setWachttijdSong();
    console.log(wachttijdSong);
  }
};

let AC, audioContext, source, xhr;

const parseSongData = songsData => {
  AC =
    "AudioContext" in window
      ? AudioContext
      : "webkitAudioContext" in window
      ? webkitAudioContext
      : document.write("Web Audio not supported");
  audioContext = new AC();
  source = audioContext.createBufferSource();
  xhr = new XMLHttpRequest();

  xhr.open("GET", `assets/songs/${songsData[currentSong].path}.mp3`);
  xhr.responseType = "arraybuffer";
  xhr.onload = function(e) {
    audioContext.decodeAudioData(e.target.response, function(b) {
      source.buffer = b;
      addAudioEffect();
    });
  };

  xhr.send(null);
  console.log(source);
};

const addAudioEffect = () => {
  //create an instance of Tuna by passing the AudioContext we use
  var tuna = new Tuna(audioContext);

  audioEffect = new tuna.Chorus({
    rate: 4, //0.01 to 8+
    feedback: 0.2, //0 to 1+
    delay: 0.0045, //0 to 1
    bypass: 0 //the value 1 starts the effect as bypassed, 0 or 1
  });

  source.connect(audioEffect);
  audioEffect.connect(audioContext.destination);
  source.start(audioContext.currentTime);
};

const parseFactData = songsData => {
  const geometry = new THREE.BoxGeometry(100, 20, 5);
  const material = new THREE.MeshPhongMaterial({
    color: "#02022C"
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.y = 60;
  cube.castShadow = true;
  cube.receiveShadow = true;

  scene.add(cube);

  fact.textContent = songsData[currentSong].facts[currentFact];
  songInfo.textContent = `${songsData[currentSong].artist} - ${
    songsData[currentSong].title
  }`;

  maxCurrentFact = songsData[currentSong].facts.length;
  // console.log(`aantal facts in array: ${maxCurrentFact}`);
  // console.log(currentFact);

  window.clearTimeout(timerNextFact);
  timerNextFact = window.setTimeout(nextFact, 10000);
};

const nextFact = () => {
  if (currentFact === maxCurrentFact - 1) {
    currentFact = 0;
  } else {
    currentFact++;
  }
  parseFactData(data);
  // console.log("volgende fact");
};

const parseTextureData = songsData => {
  new THREE.TextureLoader().load(
    `./assets/img/${songsData[currentSong].path}.png`,
    texture => {
      plaat.material.map = texture;
    }
  );
};

const createArrows = () => {
  FBX.load("./assets/models/arrow.fbx", arrowL => {
    arrowL.children[1].material.color.r = 12 / 255;
    arrowL.children[1].material.color.g = 12 / 255;
    arrowL.children[1].material.color.b = 106 / 255;

    arrowL.castShadow = true;
    arrowL.receiveShadow = true;
    arrowL.scale.set(0.15, 0.15, 0.15);
    arrowL.position.x = -70;
    arrowL.rotation.y = 180;

    scene.add(arrowL);
  });

  FBX.load("./assets/models/arrow.fbx", arrowR => {
    arrowR.children[1].material.color.r = 12 / 255;
    arrowR.children[1].material.color.g = 12 / 255;
    arrowR.children[1].material.color.b = 106 / 255;

    arrowR.castShadow = true;
    arrowR.receiveShadow = true;
    arrowR.scale.set(0.15, 0.15, 0.15);
    arrowR.position.x = 70;
    arrowR.rotation.y = -20;

    scene.add(arrowR);
  });
};

const loadJSON = () => {
  const data = `assets/json/data.json`;
  fetch(data)
    .then(r => r.json())
    .then(parse);
};

const nextSong = () => {
  if (currentSong === 4) {
    currentSong = 0;
  } else {
    currentSong++;
  }

  source.stop();

  console.log(`ik ga naar de volgende song`);

  action.setLoop(THREE.LoopOnce);
  action.play();
  action.play().reset();

  loadJSON();
};

const previousSong = () => {
  if (currentSong === 0) {
    currentSong = 4;
  } else {
    currentSong--;
  }

  source.stop();

  action.setLoop(THREE.LoopOnce);
  action.play();
  action.play().reset();

  loadJSON();
};

const animateDiscobal = () => {
  Discoball.mesh.material.opacity = 0.1;
};

const handleKeyPressed = e => {
  if (e.keyCode === 39) {
    nextSong();
    //animateDiscobal();
  }
  if (e.keyCode === 37) {
    //animateDiscobal();
    previousSong();
  }
  if (e.keyCode === 38) {
    nextFact();
  }

  if (e.keyCode === 13) {
    $loadingscreen.classList.add(`hide`);
  }

  if (e.keyCode === 32) {
    nextSong();
  }
};

const parse = songs => {
  parseSongData(songs);
  parseTextureData(songs);

  data = songs;
  parseFactData(data);
  console.log(data);
};

const init = () => {
  Arduino.setup();
  accelerometer();

  createScene();
  loadJSON();
  createDiscoball();
  createPlayer();
  createDiscoLights();
  createStars();
  createArrows();

  resetTimeoutLoadingScreen();
  loop();

  document.addEventListener("keydown", handleKeyPressed);
};

const accelerometer = () => {
  const five = require("johnny-five");
  const board = new five.Board();

  board.on("ready", function() {
    const accelerometer = new five.Accelerometer({
      controller: "MMA7361",
      pins: ["A5", "A4", "A3"],
      sleepPin: 13,
      // autoCalibrate: true,
      // override the zeroV values if you know what
      // they are from a previous autoCalibrate
      zeroV: [349.7, 396.2, 287.5]
    });

    accelerometer.on("change", function() {
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

      // console.log(this.zeroV);

      pitch = this.pitch;
      roll = this.roll;

      fuckthishit = this.pitch;
    });
  });
};

init();
