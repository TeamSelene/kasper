/*
  KASPER: Kaguya Spectral Profiler Explorer
  This is the front end of the kasper application. This script creates a leaflet
  map for displaying geospatial data associated with the kaguya sp dataset, as
  well as a chart.js chart for displaying hyperspectral data. Querries can be
  made on the kaguya dataset using url queries which are passed through the kasper
  REST API middleware.
*/

const wavelengths = [512.6, 518.4, 524.7, 530.4, 536.5, 542.8, 548.7, 554.5,
    560.5, 566.7, 572.6, 578.5, 584.5, 590.6, 596.7, 602.5, 608.6, 614.6,
    620.5, 626.7, 632.7, 638.6, 644.6, 650.6, 656.6, 662.6, 668.8, 674.7,
    680.6, 686.7, 692.6, 698.6, 704.7, 710.8, 716.7, 722.7, 728.7, 734.7,
    740.7, 746.8, 752.8, 758.7, 764.8, 770.7, 776.7, 782.7, 788.8, 794.7,
    800.7, 806.8, 812.7, 818.7, 824.8, 830.8, 836.8, 842.8, 848.8, 854.6,
    860.7, 866.7, 872.7, 878.7, 884.6, 890.7, 896.6, 902.7, 908.7, 914.6,
    920.6, 926.6, 932.6, 938.6, 944.6, 950.6, 955.4, 963.5, 971.4, 979.7,
    987.6, 993.7, 1013.1, 1019.5, 1027.7, 1035.5, 1043.6, 1051.7, 1059.7,
    1067.8, 1075.8, 1083.6, 1091.8, 1099.7, 1107.7, 1115.9, 1123.8, 1131.8,
    1139.7, 1147.8, 1155.7, 1163.8, 1171.8, 1179.8, 1187.8, 1195.8, 1203.9,
    1211.9, 1219.8, 1227.9, 1235.9, 1244.0, 1252.0, 1259.8, 1267.8, 1275.9,
    1284.2, 1292.0, 1299.8, 1307.8, 1315.9, 1323.8, 1331.8, 1339.8, 1347.8,
    1355.8, 1363.8, 1371.8, 1379.8, 1387.8, 1395.9, 1403.8, 1411.8, 1419.8,
    1427.9, 1435.7, 1443.8, 1451.9, 1459.8, 1467.8, 1475.8, 1483.9, 1491.8,
    1499.8, 1507.8, 1515.7, 1523.8, 1531.7, 1539.7, 1547.7, 1555.5, 1563.7,
    1571.7, 1579.6, 1587.7, 1595.7, 1603.7, 1611.7, 1620.1, 1628.1, 1636.1,
    1644.2, 1717.6, 1725.6, 1733.7, 1742.0, 1749.7, 1757.7, 1766.3, 1773.6,
    1782.2, 1789.8, 1797.6, 1805.8, 1813.7, 1822.0, 1830.0, 1837.6, 1845.6,
    1853.7, 1861.8, 1870.1, 1877.3, 1885.7, 1893.7, 1901.5, 1910.0, 1918.0,
    1925.3, 1934.3, 1948.8, 1957.6, 1965.9, 1973.3, 1981.3, 1989.4, 1997.7,
    2005.8, 2013.0, 2021.5, 2029.3, 2037.4, 2045.8, 2053.3, 2061.3, 2069.4,
    2077.0, 2085.5, 2093.0, 2101.9, 2109.2, 2117.0, 2125.4, 2132.9, 2141.5,
    2149.0, 2156.8, 2165.2, 2172.8, 2181.0, 2189.4, 2196.8, 2204.7, 2213.0,
    2221.2, 2228.7, 2236.8, 2245.0, 2252.5, 2260.7, 2269.2, 2276.6, 2284.7,
    2292.7, 2300.4, 2308.9, 2316.4, 2324.0, 2332.6, 2340.6, 2348.3, 2356.2,
    2364.6, 2372.2, 2380.2, 2388.5, 2396.2, 2404.2, 2412.2, 2420.2, 2428.0,
    2436.3, 2444.3, 2451.9, 2460.1, 2467.9, 2476.0, 2484.1, 2492.6, 2500.1,
    2508.1, 2516.1, 2524.1, 2532.1, 2540.0, 2548.0, 2556.0, 2564.0, 2572.0,
    2579.9, 2587.9
];

// Create the leaflet map
let map = L.map('map', {
    crs: L.CRS.EPSG4326,
    center: [0, 0],
    zoom: 1,
    minZoom: 1,
    maxZoom: 12
});

let wmsLayer = null;
let geoJSONLayer = null;

/*
  Initialize map settings on window load
*/
$(window).on("load", () => {
    let popup = null;
    let refGraph = null;

  // initialize context imagery layers

    let LOLA_color = L.tileLayer.wms('https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/earth/moon_simp_cyl.map', {
        layers: 'LOLA_color'
    })

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
    }).addTo(map);

    var LO = L.tileLayer.wms('https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/earth/moon_simp_cyl.map', {
        layers: 'LO'
    });

    let UV_LO = L.tileLayer.wms('https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/earth/moon_simp_cyl.map', {
        layers: 'uv_lo'
    });

    // baselayers initialized
    let baseLayers = {
        'USGS_Map Default (LOLA_Color)': LOLA_color,
        'USGS_Map LOLA_Steel': LOLA_Steel,
        'USGS_Map LOLA_BW': LOLA_BW,
        'USGS_Map LROC_WAC': LROC_WAC,
        'USGS_Map KaguyaTC_Ortho': KaguyaTC_Ortho,
        'USGS_Map LO': LO,
        'USGS_Map UV_LO': UV_LO
    };

    // Add layer controll
    L.control.layers(baseLayers).addTo(map);

    wmsLayer = L.tileLayer.wms('http://localhost:8080/geoserver/selene/wms', {
     layers: '56d64f9a7a0066f09b0b5c42b31f3a3e936a3b0351e88393f39d118e',
     transparent: true,
      }).addTo(map);

      // The geoJSON layer used to display vector data
    geoJSONLayer = L.geoJSON(null, {
        onEachFeature: onEachFeature,
        pointToLayer: function(point, latlng) {
          let dotIcon = new L.DivIcon({
            iconSize:     [7, 10],
            className: 'leaflet-svg-icon',
            html: `<svg width="7" height="10"><rect width="7" height="10" style="fill:rgb(255,0,0);stroke-width:1;stroke:rgb(0,0,50);" /></svg>`
          });
          return L.marker(latlng, {icon: dotIcon});
        },
    }).addTo(map);

    // On Each Feature - add click even to features to display new graph
    function onEachFeature(point, layer) {
        layer.on('click', (e) => {
            let loc = L.latLng(point.coordinates[1], point.coordinates[0]);
            let curZoom = map.getZoom();
            if(curZoom < 6) map.setZoomAround(loc,6);
            map.panTo(loc);
            console.log(map.center);

            $('#refGraph').remove();
            $('#ref-box').append('<canvas id="refGraph" width="800" height="300"></canvas>');
            console.log(point);
            refGraph = createRefData(point);

        });
    }

    let urlQuery = getParameterByName('query');
    // We have a query parameter
    if(urlQuery){
      updateQuery(urlQuery, geoJSONLayer);
    }
    else {
        $.getJSON('api/points', (data) => {
            plotPoints(geoJSONLayer, data.Points)
        });
    }
});

map.on('baselayerchange', (e) => {
    if (wmsLayer){
      wmsLayer.bringToFront();
    }
});

// Function to get the current frame and produce a geospatial query to generate
// a new geoJSON layer. Commented as sponsors requested focus on raw queries
// map.on('click', (e) => {
//
//   var loc = L.latLng(e.latlng.lat, e.latlng.lng);
//   let curZoom = map.getZoom();
//   if(curZoom < 6) map.setZoomAround(loc,6);
//   map.panTo(loc);
//
//   let bounds = map.getBounds();
//   let sw = bounds.getSouthWest();
//   let ne = bounds.getNorthEast()
//   console.log(bounds);
//
//   let query   = {"loc":{"$geoWithin":{"$box":[[sw.lat,sw.lng],[ne.lat,ne.lng]]}}};
//   let qry     = JSON.stringify(query);
//   let getstr  = `api/query/${qry}`;
//   console.log(getstr);
//   $.getJSON(getstr, (data) => {
//     console.log(data);
//     geoJSONLayer = null;
//     geoJSONLayer = L.geoJSON(null, {
//         onEachFeature: onEachFeature,
//         pointToLayer: function(point, latlng) {
//           let dotIcon = new L.DivIcon({
//             iconSize:     [7, 10],
//             className: 'leaflet-svg-icon',
//             html: `<svg width="7" height="10"><rect width="7" height="10" style="fill:rgb(255,0,0);stroke-width:1;stroke:rgb(0,0,50);" /></svg>`
//           });
//           return L.marker(latlng, {icon: dotIcon});
//         },
//     }).addTo(map);
//     plotPoints(geoJSONLayer, data.Points);
//   });
// });
/*
  Method to take the url GET query parameters and to handle the query.
*/
function updateQuery(urlQuery, geoJSONLayer) {
    console.log(urlQuery);
    //Base api url
    let getstr = 'api/';
    //Split on space
    let split = urlQuery.split(" ");
    console.log(split[0]);

    console.log(split.length)

    // CASE: near query
    if (split[0].toLowerCase() === "near" && split.length == 3) {
        let lat = parseFloat(split[1]);
        let lng = parseFloat(split[2]);
        console.log(lat);
        getstr += `near/${lat}/${lng}`;
        map.panTo([lng, lat]);
    }

    // CASE: raw query
    else if (split[0].toLowerCase() == "query") {
      let qry = split[1];
      console.log(qry);
      getstr +=`query/${qry}`;
    }

    // call plot points on data returned from images collection
    if (getstr != "api/"){
      $.getJSON(getstr, (data) => {
          console.log(data);
          plotPoints(geoJSONLayer, data.Points);
      });
    }

    // CASE: incidence query
    else if (split[0].toLowerCase() === "incidence" && split.length == 2) {
        let ang = parseFloat(split[1]);
        getstr += `incidence/${ang}`;
        // Use different plot method for angles collection data
        $.getJSON(getstr, (data) => {
            console.log(data);
            plotAngularPoints(geoJSONLayer, data.Points);
        });
    }

    // CASE: layer request
    else if (split[0].toLowerCase() == "layer") {
      getstr += `query/`;
      if ( split.length == 1 ){}
      else {
        let qry = split[1];
        getstr += `${qry}`;
      }
      $.getJSON(getstr, (data) => {
        console.log(data);
        if (data.error == 0){
          if(data.hasOwnProperty('layer')){
            wmsLayer = L.tileLayer.wms('http://localhost:8080/geoserver/selene/wms', {
            layers: data.layer,
            format: 'image/png',
            transparent: true,
            styles: 'bluered'
            }).addTo(map);
            wmsLayer.bringToFront();
          }
          else {
            plotPoints(geoJSONLayer, data.Points);
          }
        }
      });
    $.getJSON('api/points', (data) => {
        plotPoints(geoJSONLayer, data.Points);
    });
    }

  }


/*
  Method to generate the data atrribute of the GeoJSON layer using GeoJSON point
  objects from the database
*/
function plotPoints(geoJSONLayer, data) {
    // Grab the points of every element.
    let geoDataPoints = data.map(image =>
          // for each point in pts array of each image
            image.pts.map((point, i) =>
                ({
                    eid: image._id,
                    index: i,
                    type: point.loc.type,
                    coordinates: point.loc.coordinates,
                })
            )
        )
        .reduce((a, b) => a.concat(b), []);
    geoJSONLayer.addData(geoDataPoints);
}


/*
  Performs the same operation as plotPoints but using the angles collection,
  which stores geospatial data differently
*/
function plotAngularPoints(geoJSONLayer, data) {
  let geoDataPoints = data.map(image =>
          image.pts.map((point, i) =>
              ({
                  eid: image._id,
                  index: i,
                  type: "Point",
                  coordinates: [point.meta.CENTER_LONGITUDE - 180, point.meta.CENTER_LATITUDE],
              })
          )
      )
      .reduce((a, b) => a.concat(b), []);
  geoJSONLayer.addData(geoDataPoints);
}


/*
  Method used to generate a new reflectance dataset to be consumed by a chart.js
  plot. It performs a rest API image request to get the reflectance data
  associated with a specified point.
*/
function createRefData(point) {
    $.getJSON(`api/image/${point.eid}/${point.index}`, (data) => {
        const ref = binArray2FloatArray(data.ref1);

        let chdata = {
            labels: wavelengths,
            datasets: [{
                label: "REF 1",
                lineTension: 0.1,
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 1,
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: ref,
                spanGaps: false,
            }]
        };
        return newChart(chdata);
    });
}


/*
  Method used to create a chart.js object given a valid dataset.
*/
function newChart(chdata) {
    let ctx = document.getElementById('refGraph');
    let chart = new Chart(ctx, {
        type: 'line',
        data: chdata,
        height: 400,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 1.2,
                    },
                }],
            },
            showlines: true,
        }
    });
    return chart
}


/*
  Simple method to convert a string to a byte array, and from there to a Float32Array
*/
function binArray2FloatArray(string) {
    let byteArray = base64js.toByteArray(string);
    return new Float32Array(byteArray.buffer);
}


/*
  Taken from Stack Overflow answer: http://stackoverflow.com/a/901144/7286670
*/
function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
