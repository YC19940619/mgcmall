/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.OBJExporterNew = function () {};

THREE.OBJExporterNew.prototype = {

	constructor: THREE.OBJExporterNew,

	parse: function ( object ) {

		var output = '';

		var indexVertex = 0;
		var indexVertexUvs = 0;
		var indexNormals = 0;

		var vertex = new THREE.Vector3();
		var normal = new THREE.Vector3();
		var uv = new THREE.Vector2();

		var i, j, k, l, m, face = [];

        var parseMeshNew = function ( mesh ) {

            var nbVertex = 0;
            //var nbNormals = 0;
            //var nbVertexUvs = 0;

            var geometry = mesh.geometry;

            var normalMatrixWorld = new THREE.Matrix3();

            //vertices    faces /a,b,c, normal(x,y,z), materialIndex, vertexNormals(0,1,2(x,y,z))
            if ( geometry instanceof THREE.Geometry ) {

                var vertices = geometry.vertices;
                var faces = geometry.faces;
                // shortcuts

                // name of the mesh object
                output += 'o ' + mesh.name + '\n';

                // name of the mesh material
                if ( mesh.material && mesh.material.name ) {
                    output += 'usemtl ' + mesh.material.name + '\n';
                }

                // vertices

                if( vertices !== undefined ) {

                    for ( i = 0, l = vertices.length; i < l; i ++, nbVertex++ ) {

                        var vertex = vertices[i];

                        // transfrom the vertex to world space
                        //vertex.applyMatrix4( mesh.matrixWorld );

                        // transform the vertex to export format
                        output += 'v ' + vertex.x.toPrecision(7) + ' ' + vertex.y.toPrecision(7) + ' ' + vertex.z.toPrecision(7) + '\n';

                    }

                }

                /*// normals

                if( normals !== undefined ) {

                    normalMatrixWorld.getNormalMatrix( mesh.matrixWorld );

                    for ( i = 0, l = normals.count; i < l; i ++, nbNormals++ ) {

                        normal.x = normals.getX( i );
                        normal.y = normals.getY( i );
                        normal.z = normals.getZ( i );

                        // transfrom the normal to world space
                        normal.applyMatrix3( normalMatrixWorld );

                        // transform the normal to export format
                        output += 'vn ' + normal.x.toPrecision(7) + ' ' + normal.y.toPrecision(7) + ' ' + normal.z.toPrecision(7) + '\n';

                    }

                }*/

                var vNormals = [];
                // faces
                for ( i = 0, l = faces.length; i < l; i ++ )
                {
                    var face_t = faces[i];
                    for(j=0; j<3; j++)
                    {
                        var vnn = face_t.vertexNormals[j];
                        var key = vnn.x.toPrecision(7) + '_' + vnn.y.toPrecision(7) + '_' + vnn.z.toPrecision(7);
                        if (undefined == vNormals[key])
                            vNormals[key] = vnn;
                    }
                }

                var vnindex = 0;
                for (k in vNormals)
                {
                    var vnn = vNormals[k];
                    output += 'vn ' + vnn.x.toPrecision(7) + ' ' + vnn.y.toPrecision(7) + ' ' + vnn.z.toPrecision(7) + '\n';
                    vNormals[k] = vnindex;
                    vnindex ++;
                };

                // faces
                for ( i = 0, l = faces.length; i < l; i ++ )
                {
                    var face_t = faces[i];
                    var vnn0 = face_t.vertexNormals[0];
                    var vnn1 = face_t.vertexNormals[1];
                    var vnn2 = face_t.vertexNormals[2];
                    var key0 = vnn0.x.toPrecision(7) + '_' + vnn0.y.toPrecision(7) + '_' + vnn0.z.toPrecision(7);
                    var key1 = vnn1.x.toPrecision(7) + '_' + vnn1.y.toPrecision(7) + '_' + vnn1.z.toPrecision(7);
                    var key2 = vnn2.x.toPrecision(7) + '_' + vnn2.y.toPrecision(7) + '_' + vnn2.z.toPrecision(7);
                    face[0] = (face_t.a + 1) + '/0/' + (1 + vNormals[key0]);
                    face[1] = (face_t.b + 1) + '/0/' + (1 + vNormals[key1]);
                    face[2] = (face_t.c + 1) + '/0/' + (1 + vNormals[key2]);
                    // transform the face to export format
                    output += 'f ' + face.join( ' ' ) + "\n";
                }

            } else {

                console.warn( 'THREE.OBJExporterNew.parseMesh(): geometry type unsupported', geometry );

            }

            // update index
            indexVertex += nbVertex;
            //indexVertexUvs += nbVertexUvs;
            //indexNormals += nbNormals;

        };

		var parseMesh = function ( mesh ) {

			var nbVertex = 0;
			var nbNormals = 0;
			var nbVertexUvs = 0;

			var geometry = mesh.geometry;

			var normalMatrixWorld = new THREE.Matrix3();

			if ( geometry instanceof THREE.Geometry ) {

				geometry = new THREE.BufferGeometry().setFromObject( mesh );

			}

			if ( geometry instanceof THREE.BufferGeometry ) {

				// shortcuts
				var vertices = geometry.getAttribute( 'position' );
				var normals = geometry.getAttribute( 'normal' );
				var uvs = geometry.getAttribute( 'uv' );
				var indices = geometry.getIndex();

				// name of the mesh object
				output += 'o ' + mesh.name + '\n';

				// name of the mesh material
				if ( mesh.material && mesh.material.name ) {
					output += 'usemtl ' + mesh.material.name + '\n';
				}

				// vertices

				if( vertices !== undefined ) {

					for ( i = 0, l = vertices.count; i < l; i ++, nbVertex++ ) {

						vertex.x = vertices.getX( i );
						vertex.y = vertices.getY( i );
						vertex.z = vertices.getZ( i );

						// transfrom the vertex to world space
						vertex.applyMatrix4( mesh.matrixWorld );

						// transform the vertex to export format
						output += 'v ' + vertex.x.toPrecision(7) + ' ' + vertex.y.toPrecision(7) + ' ' + vertex.z.toPrecision(7) + '\n';

					}

				}

				// uvs

				if( uvs !== undefined ) {

					for ( i = 0, l = uvs.count; i < l; i ++, nbVertexUvs++ ) {

						uv.x = uvs.getX( i );
						uv.y = uvs.getY( i );

						// transform the uv to export format
						output += 'vt ' + uv.x.toPrecision(7) + ' ' + uv.y.toPrecision(7) + '\n';

					}

				}

				// normals

				if( normals !== undefined ) {

					normalMatrixWorld.getNormalMatrix( mesh.matrixWorld );

					for ( i = 0, l = normals.count; i < l; i ++, nbNormals++ ) {

						normal.x = normals.getX( i );
						normal.y = normals.getY( i );
						normal.z = normals.getZ( i );

						// transfrom the normal to world space
						normal.applyMatrix3( normalMatrixWorld );

						// transform the normal to export format
						output += 'vn ' + normal.x.toPrecision(7) + ' ' + normal.y.toPrecision(7) + ' ' + normal.z.toPrecision(7) + '\n';

					}

				}

				// faces
                if( indices !== null ) {

                    for ( i = 0, l = indices.count; i < l; i += 3 ) {

                        for( m = 0; m < 3; m ++ ){

                            j = indices.getX( i + m ) + 1;

                            face[ m ] = ( indexVertex + j ) + '/' + ( uvs ? ( indexVertexUvs + j ) : '' ) + '/' + ( indexNormals + j );

                        }

                        // transform the face to export format
                        output += 'f ' + face.join( ' ' ) + "\n";

                    }

                } else {

                    for ( i = 0, l = vertices.count; i < l; i += 3 ) {

                        for( m = 0; m < 3; m ++ ){

                            j = i + m + 1;

                            face[ m ] = ( indexVertex + j ) + '/' + ( uvs ? ( indexVertexUvs + j ) : '' ) + '/' + ( indexNormals + j );

                        }

                        // transform the face to export format
                        output += 'f ' + face.join( ' ' ) + "\n";

                    }

                }

			} else {

				console.warn( 'THREE.OBJExporterNew.parseMesh(): geometry type unsupported', geometry );

			}

			// update index
			indexVertex += nbVertex;
			indexVertexUvs += nbVertexUvs;
			indexNormals += nbNormals;

		};

		var parseLine = function( line ) {

			var nbVertex = 0;

			var geometry = line.geometry;
			var type = line.type;

			if ( geometry instanceof THREE.Geometry ) {

				geometry = new THREE.BufferGeometry().setFromObject( line );

			}

			if ( geometry instanceof THREE.BufferGeometry ) {

				// shortcuts
				var vertices = geometry.getAttribute( 'position' );
				var indices = geometry.getIndex();

				// name of the line object
				output += 'o ' + line.name + '\n';

				if( vertices !== undefined ) {

					for ( i = 0, l = vertices.count; i < l; i ++, nbVertex++ ) {

						vertex.x = vertices.getX( i );
						vertex.y = vertices.getY( i );
						vertex.z = vertices.getZ( i );

						// transfrom the vertex to world space
						vertex.applyMatrix4( line.matrixWorld );

						// transform the vertex to export format
						output += 'v ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + '\n';

					}

				}

				if ( type === 'Line' ) {

					output += 'l ';

					for ( j = 1, l = vertices.count; j <= l; j++ ) {

						output += ( indexVertex + j ) + ' ';

					}

					output += '\n';

				}

				if ( type === 'LineSegments' ) {

					for ( j = 1, k = j + 1, l = vertices.count; j < l; j += 2, k = j + 1 ) {

						output += 'l ' + ( indexVertex + j ) + ' ' + ( indexVertex + k ) + '\n';

					}

				}

			} else {

				console.warn('THREE.OBJExporterNew.parseLine(): geometry type unsupported', geometry );

			}

			// update index
			indexVertex += nbVertex;

		};

		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				parseMeshNew( child );

			}

			if ( child instanceof THREE.Line ) {

				parseLine( child );

			}

		} );

		return output;

	}

};
