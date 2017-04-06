let popup = null;
let refGraph = null;
let map = L.map('map', {
    crs: L.CRS.EPSG4326,
    center: [0, 0],
    zoom: 1,
    minZoom: 1,
    maxZoom: 12,
    layers: baseLayers
});

let wmsLayer = L.tileLayer.wms('https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/earth/moon_simp_cyl.map', {
    layers: 'LOLA_color'
}).addTo(map);

let LOLA_Steel = L.tileLayer.wms('https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/earth/moon_simp_cyl.map', {
    layers: 'LOLA_steel'
});

let LOLA_BW = L.tileLayer.wms('https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/earth/moon_simp_cyl.map', {
    layers: 'LOLA_bw'
});

let LROC_WAC = L.tileLayer.wms('https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/earth/moon_simp_cyl.map', {
    layers: 'LROC_WAC'
});

var KaguyaTC_Ortho = L.tileLayer.wms('https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/earth/moon_simp_cyl.map', {
    layers: 'KaguyaTC_Ortho'
});

var LO = L.tileLayer.wms('https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/earth/moon_simp_cyl.map', {
    layers: 'LO'
});

let UV_LO = L.tileLayer.wms('https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/earth/moon_simp_cyl.map', {
    layers: 'uv_lo'
});

let baseLayers = {
    'USGS_Map Default (LOLA_Color)': wmsLayer,
    'USGS_Map LOLA_Steel': LOLA_Steel,
    'USGS_Map LOLA_BW': LOLA_BW,
    'USGS_Map LROC_WAC': LROC_WAC,
    'USGS_Map KaguyaTC_Ortho': KaguyaTC_Ortho,
    'USGS_Map LO': LO,
    'USGS_Map UV_LO': UV_LO
};

function onEachFeature(point, layer) {
    layer.on('click', (e) => {
        map.panTo(L.latLng(point.coordinates[1], point.coordinates[0]));

        console.log(map.center);

        $('#refGraph').remove();
        $('#ref-box').append('<canvas id="refGraph" width="800" height="300"></canvas>');
        console.log(point);
        refGraph = createRefData(point);

    });
}

function makeQuery(query) {
    console.log("succ");
    let split = query.split(" ");
    if (split[0].toLowerCase() === "near" && split.length == 3) {
        console.log("succ");
    }
}

L.control.layers(baseLayers).addTo(map);

let geoJSONLayer = L.geoJSON(null, {
    onEachFeature: onEachFeature,
}).addTo(map);
