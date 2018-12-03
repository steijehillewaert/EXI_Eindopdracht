const THREE = require(`three`);
const loader = new THREE.ObjectLoader();

class Discoball {
    constructor() {
        loader.load("./assets/json/discoball.json", discoball => {
            discoball.scale.set(0.25, 0.25, 0.25);
            discoball.position.x = 0;
            discoball.position.z = 0;

            // const mat = new THREE.MeshBasicMaterial({
            //     color: 0xffff00
            // });

            // this.mesh = new THREE.Mesh(discoball, mat);

            this.mesh = discoball;
        });
    }

    spinBall() {
        this.mesh.rotation.y += 0.005;
    }

};

module.exports = new Discoball();