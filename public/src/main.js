$(window).on("load", () => {
    $.getJSON('api/images', (data) => {
      console.log(data);
      plotPoints(geoJSONLayer, data.Images)
    });
});

function plotPoints(geoJSONLayer, data) {
    // Grab the points of every element.
    let geoDataPoints = data.map(elem =>
        elem.pts.map(point =>
            ({
                type: point.loc.type,
                coordinates: point.loc.coordinates,
                ref1: binArray2FloatArray(point.ref1),
                ref2: binArray2FloatArray(point.ref2)
            })
        ))
        .reduce((a, b) => a.concat(b), [])
    geoJSONLayer.addData(geoDataPoints);
}

function binArray2FloatArray(string) {
    console.log(string);
    let byteArray = base64js.toByteArray(string);
    return new Float32Array(byteArray.buffer);
}
