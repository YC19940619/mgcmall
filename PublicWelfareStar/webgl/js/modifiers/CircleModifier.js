/*
    y轴弯曲成圆弧，writed by tanglong 2017-8-1
*/


THREE.CircleModifier = function () {

};

THREE.CircleModifier.prototype = {

    constructor: THREE.CircleModifier,

    set: function (origin) {
        this.origin = origin;
        return this
    },

    modify: function (geometry, width) {

        var tmpVector = new THREE.Vector3(this.origin.x, this.origin.y, this.origin.z);
        var newVert = new THREE.Vector3(0,0,0);
        var rotateMatrix = new THREE.Matrix4();
        for ( var i = 0, iL = geometry.vertices.length; i < iL; i++ ) {
            var vert = geometry.vertices[i];
            if (vert.x == this.origin.x)
                continue;

            tmpVector.set(this.origin.x, this.origin.y, vert.z);
            var radius = this.origin.distanceTo(tmpVector);

            var theta = (vert.x - this.origin.x) / width * Math.PI * 2;
            rotateMatrix.makeRotationY(theta);
            newVert.x = 0;
            newVert.y = 0;
            newVert.z = radius;
            var oldY = vert.y;
            geometry.vertices[i].copy(newVert.applyMatrix4(rotateMatrix).add(this.origin));
            geometry.vertices[i].y = oldY;
        }

        //geometry.computeFaceNormals();
        //geometry.computeVertexNormals();
        geometry.verticesNeedUpdate = true;
        //geometry.normalsNeedUpdate = true;
        return this;
    }
}