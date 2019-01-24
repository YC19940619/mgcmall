/**
 * Created by tanglong on 2017/9/22.
 */

THREE.MeshVolume = {
    GetVolume: function ( mesh ) {
        if ( mesh instanceof THREE.Mesh ) {

            var geometry = mesh.geometry;

            if( geometry instanceof THREE.BufferGeometry ) {

                geometry = new THREE.Geometry().fromBufferGeometry( geometry );
            }

            if ( geometry instanceof THREE.Geometry ) {
                if (null == geometry.boundingBox || undefined == geometry.boundingBox)
                    geometry.computeBoundingBox();
                var origin = geometry.boundingBox.min;

                var vertices = geometry.vertices;
                var faces = geometry.faces;
                var vols = 0;
                var p1 = new THREE.Vector3();
                var p2 = new THREE.Vector3();
                var p3 = new THREE.Vector3();

                for ( var i = 0, l = faces.length; i < l; i ++ ) {
                    var face = faces[ i ];
                    p1.subVectors(vertices[face.a], origin);
                    p2.subVectors(vertices[face.b], origin);
                    p3.subVectors(vertices[face.c], origin);
                    vols += this.SignedVolumeOfTriangle(p1, p2, p3);
                }
                return this.customRound(Math.abs(vols), 4);
            }

        }
        return -1;
    },

    SignedVolumeOfTriangle : function (p1, p2, p3)
    {
        var v321 = p3.x*p2.y*p1.z;
        var v231 = p2.x*p3.y*p1.z;
        var v312 = p3.x*p1.y*p2.z;
        var v132 = p1.x*p3.y*p2.z;
        var v213 = p2.x*p1.y*p3.z;
        var v123 = p1.x*p2.y*p3.z;
        var singnedVolume=(1/6)*(-v321 + v231 + v312 - v132 - v213 + v123);
        return singnedVolume;
    },

    customRound : function (number,fractiondigits){
        return Math.round(number*Math.pow(10,fractiondigits))/ Math.pow(10,fractiondigits);
    },

    SuperficialAreaOfMesh : function (mesh) {
        if ( mesh instanceof THREE.Mesh ) {

            var geometry = mesh.geometry;

            if( geometry instanceof THREE.BufferGeometry ) {

                geometry = new THREE.Geometry().fromBufferGeometry( geometry );
            }

            if ( geometry instanceof THREE.Geometry ) {

                if (null == geometry.boundingBox || undefined == geometry.boundingBox)
                    geometry.computeBoundingBox();
                var origin = geometry.boundingBox.min;

                var vertices = geometry.vertices;
                var faces = geometry.faces;
                var _area = 0.0;
                var va = new THREE.Vector3();
                var vb = new THREE.Vector3();
                var vc = new THREE.Vector3();

                for ( var i = 0, l = faces.length; i < l; i ++ ) {

                    var face = faces[ i ];

                    va.subVectors(vertices[face.a], origin);
                    vb.subVectors(vertices[face.b], origin);
                    vc.subVectors(vertices[face.c], origin);

                    var ab = {x:vb.x-va.x,y:vb.y-va.y,z:vb.z-va.z};
                    //vb.clone().sub(va);
                    var ac = {x:vc.x-va.x,y:vc.y-va.y,z:va.z-vc.z};
                    //vc.clone().sub(va);

                    var cross = new THREE.Vector3();
                    cross = this.crossVectors( ab, ac );
                    _area += Math.sqrt(Math.pow(cross.x,2)+Math.pow(cross.y,2)+Math.pow(cross.z,2))/2;
                }
                return this.customRound(Math.abs(_area), 4);
            }

        }
        return -1;
    },

    crossVectors: function ( a, b ) {
        var ax = a.x, ay = a.y, az = a.z;
        var bx = b.x, by = b.y, bz = b.z;
        var P={x:ay * bz - az * by,
            y:az * bx - ax * bz,
            z:ax * by - ay * bx}

        return P;
    }

}