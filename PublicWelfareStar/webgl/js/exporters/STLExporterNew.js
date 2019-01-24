/**
 * @author kovacsv / http://kovacsv.hu/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.STLExporterNew = function () {};

THREE.STLExporterNew.prototype = {

	constructor: THREE.STLExporterNew,

	parse: ( function () {

		var vector = new THREE.Vector3();
		var normalMatrixWorld = new THREE.Matrix3();

		return function parse( mesh ) {

			var output = '';

			output += 'solid exported\n';

			if ( mesh instanceof THREE.Mesh ) {

				var geometry = mesh.geometry;
				var matrixWorld = mesh.matrixWorld;

				if( geometry instanceof THREE.BufferGeometry ) {

					geometry = new THREE.Geometry().fromBufferGeometry( geometry );
				}

				if ( geometry instanceof THREE.Geometry ) {

					var vertices = geometry.vertices;
					var faces = geometry.faces;

					normalMatrixWorld.getNormalMatrix( matrixWorld );

					for ( var i = 0, l = faces.length; i < l; i ++ ) {

						var face = faces[ i ];

						vector.copy( face.normal ).applyMatrix3( normalMatrixWorld ).normalize();

						output += '\tfacet normal ' + vector.x.toPrecision(7) + ' ' + vector.y.toPrecision(7) + ' ' + vector.z.toPrecision(7) + '\n';
						output += '\t\touter loop\n';

						var indices = [ face.a, face.b, face.c ];

						for ( var j = 0; j < 3; j ++ ) {

							vector.copy( vertices[ indices[ j ] ] ).applyMatrix4( matrixWorld );
							output += '\t\t\tvertex ' + vector.x.toPrecision(7) + ' ' + vector.y.toPrecision(7) + ' ' + vector.z.toPrecision(7) + '\n';
						}

						output += '\t\tendloop\n';
						output += '\tendfacet\n';
					}

				}

			}

			output += 'endsolid exported\n';

			return output;

		};

	}() )

};
