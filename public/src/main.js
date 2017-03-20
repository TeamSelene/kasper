$(window).on("load", () => {
    $.getJSON('api/images', (data) => {
      plotPoints(geoJSONLayer, data.Images)
    });
});

function plotPoints(geoJSONLayer, data) {
    // Grab the points of every element.
    let geoDataPoints = data.map(elem => {
      let e = elem._id;
      let i = 0;
      return elem.pts.map(point => {
            let pt = {
                eid: elem._id,
                index: i,
                type: point.loc.type,
                coordinates: point.loc.coordinates,
            };
            i += 1;
            return pt;
          }
        );
      })
        .reduce((a, b) => a.concat(b), []);
    geoJSONLayer.addData(geoDataPoints);
}

function binArray2FloatArray(string) {
    let byteArray = base64js.toByteArray(string);
    return new Float32Array(byteArray.buffer);
}
