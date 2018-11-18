const THREE = require(`three`);

class Vinyl {
    constructor() {

        const geom = new THREE.CircleGeometry(70, 32);

        geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

        const loader = new THREE.TextureLoader();

        const mat = new THREE.MeshBasicMaterial({
            map: loader.load('./assets/img/vinyl.png')
        });

        this.mesh = new THREE.Mesh(geom, mat);
    }

    spinVinyl() {
        this.mesh.rotation.y += 0.005;
    }
};

module.exports = new Vinyl();