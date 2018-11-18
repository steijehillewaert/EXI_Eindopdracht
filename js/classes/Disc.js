const THREE = require(`three`);

class Disc {
    constructor() {

        const geom = new THREE.RingGeometry(1, 50, 32);

        geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

        const loader = new THREE.TextureLoader();

        const mat = new THREE.MeshLambertMaterial({
            map: loader.load('./assets/img/vinyl.png')
        });

        this.mesh = new THREE.Mesh(geom, mat);
    }

    spinDisc() {
        this.mesh.rotation.y += 0.005;
    }
};

module.exports = new Disc();