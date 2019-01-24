/**
 * Created by tanglong on 2017/11/24.
 */
document.write("<script src='build/three.js'></script>");

CnFontParams = function () {
    this.size = 100;
    this.height = 10;
    this.curveSegments = 3;
    this.bevelThickness = 3;
    this.bevelSize = 3;
    this.bevelEnabled = true;
    this.bevelSegments = 3;
}

CnFont = function(fontname, fontParams, onLoadOver)
{
    this.fontname = fontname;
    this.font = null;
    this.text = '';
    this.fontParams = fontParams;
    var loader = new THREE.FontLoader();
    loader.load('fonts/' + fontname + '.json', function (response) {
        this.font = response;
        if (null != onLoadOver && undefined != onLoadOver)
            onLoadOver();
    }.bind(this), undefined);
}

CnFont.prototype.setParams = function(fontParams)
{
    this.fontParams = fontParams;
}

CnFont.prototype.IsReady = function()
{
    return null != this.font;
}

CnFont.prototype.LoadTextMesh = function(text)
{
    if (!this.IsReady())
        return null;

    return this.createTextMesh(text);
}

CnFont.prototype.createTextMesh = function(text)
{
    var textGeo = new THREE.TextGeometry( text, {

        font: this.font,
        size: this.fontParams.size,
        height: this.fontParams.height,
        curveSegments: this.fontParams.curveSegments,
        bevelThickness: this.fontParams.bevelThickness,
        bevelSize: this.fontParams.bevelSize,
        bevelEnabled: this.fontParams.bevelEnabled,
        bevelSegments: this.fontParams.bevelSegments,
        material: 0,
        extrudeMaterial: 1
    });

    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();

    if ( ! this.fontParams.bevelEnabled && textGeo.faces != undefined) {
        var triangleAreaHeuristics = 0.1 * ( height * size );

        for ( var i = 0; i < textGeo.faces.length; i ++ ) {
            var face = textGeo.faces[ i ];

            if ( face.materialIndex == 1 ) {
                for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
                    face.vertexNormals[ j ].z = 0;
                    face.vertexNormals[ j ].normalize();
                }

                var va = textGeo.vertices[ face.a ];
                var vb = textGeo.vertices[ face.b ];
                var vc = textGeo.vertices[ face.c ];

                var s = THREE.GeometryUtils.triangleArea( va, vb, vc );

                if ( s > triangleAreaHeuristics ) {
                    for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
                        face.vertexNormals[ j ].copy( face.normal );
                    }
                }
            }
        }
    }

    return new THREE.Mesh( textGeo, null );
}