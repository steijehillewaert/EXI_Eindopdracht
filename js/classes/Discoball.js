const THREE = require(`three`);

class Discoball {
    constructor() {

        const geo = new THREE.SphereGeometry(70, 30, 20);
        const mat = new THREE.MeshPhongMaterial({
            emissive: "#222",
            shininess: 50,
            reflectivity: 3.5,
            shading: THREE.FlatShading,
            specular: "white",
            color: "gray",
            side: THREE.DoubleSide,
            // envMap: cubeCamera.renderTarget.texture,
            combine: THREE.AddOperation
        });
        this.mesh = new THREE.Mesh(geo, mat);

        const discoball = this.mesh;

        discoball.scale.set(0.1, 0.1, 0.1);
        discoball.position.y = 11;
    }
};

module.exports = new Discoball();