const THREE = require(`three`);
const loader = new THREE.JSONLoader();
const Vinyl = require(`./classes/Vinyl.js`);

let scene,
  camera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  HEIGHT,
  WIDTH,
  renderer;

let hemisphereLight, shadowLight, ambientLight;

const createVinyl = () => {
  scene.add(Vinyl.mesh);
};

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

const loop = () => {
  Vinyl.spinVinyl();
  requestAnimationFrame(loop);
  renderer.render(scene, camera);
};

const JSONLoader = url =>
  new Promise(resolve => loader.load(url, geometry => resolve(geometry)));

const loadModels = () => {
  JSONLoader(`./assets/json/recordplayer.json`)
    .then(geometry => {
      const material = new THREE.MeshNormalMaterial(0x0000ff);
      const player = new THREE.Mesh(geometry, material);
      player.scale.set(7, 7, 7);
      scene.add(player);
    })
    .catch(err => {
      console.log(`Error: ${err}`);
    });
};

const init = () => {
  createScene();
  loadModels();
  createLights();
  createVinyl();
  loop();
};

init();
