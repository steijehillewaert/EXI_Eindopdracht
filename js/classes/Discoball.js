const THREE = require(`three`);

class Discoball {
    constructor() {

        const geom = new THREE.SphereGeometry(30, 32, 32);

        const mat = new THREE.MeshBasicMaterial({
            color: 0xffff00
        });

        this.mesh = new THREE.Mesh(geom, mat);

    }



};

module.exports = new Discoball();