const THREE = require(`three`);

class Stars {
    constructor() {

        const starGeo = new THREE.SphereGeometry(1000, 100, 50);
        //hoeveelheid sterren
        const starAmt = 10000;
        const starMat = {
            size: 1.0,
            opacity: 0.7,
            color: "#F852FC"
        };
        const starMesh = new THREE.PointsMaterial(starMat);

        for (var i = 0; i < starAmt; i++) {
            var starVertex = new THREE.Vector3();
            starVertex.x = Math.random() * 1000 - 500;
            starVertex.y = Math.random() * 1000 - 500;
            starVertex.z = Math.random() * 1000 - 500;
            starGeo.vertices.push(starVertex);
        }
        this.mesh = new THREE.Points(starGeo, starMesh);
    }
};

module.exports = new Stars();