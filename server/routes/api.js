const URL         =   "localhost"
const PORT        =   27017
const DB          =   "selene"
const IMAGES      =   "images"
const ANGLES      =   "image_angles"

const express     =   require("express");
const router      =   express.Router();
const monk        =   require("monk");
const PythonShell =   require('python-shell');
const db          =   monk(`${URL}:${PORT}/${DB}`);


/*
  points: gets a subset of the data to be displayed as vector data. Has no
  parameters.
*/
router.get('/points', (req, res) => {
  let data    =   {};
  let images  =   db.get(IMAGES);

  images.find({}, { limit:80  , fields: "pts.loc" }, (err, items) => {
    if(items.length > 0) {
      data["error"]   =   0;
      data["Points"]  =   items;
      res.json(data);
    }
    else {
      data["error"]   =   1;
      data["message"]  =   "No Points Found";
      res.json(data);
    }
  });
});

/*
  query: dispatches a python script to perform query, either returns a new
  image layer or a geojson object containinng location data.
*/
router.get('/query/:qry?', (req, res) => {
    // set variables
    let pyshell = new PythonShell('new_layer.py'),
    data        = {},
    qry         = req.params.qry;

    let query = {};

    if(qry) {
      query = JSON.parse(qry);
    }
    pyshell.send(JSON.stringify(query));

    console.log(query);
    // On recieveing response from the python script.
    pyshell.on('message', (item) => {
      console.log(item.length)
      if(item) {
      data["error"]   = 0;
      // Decide if geojson or layer name
      if(item.length < 100) data["layer"] = item.toString('utf8', 0, item.length - 1);
      else data["Points"] = json.parse(item);
      console.log(item);
      }
      // Query unsuccessful
      else {
        data["error"]   =   1;
        data["message"]  =   "No Points Found";
      }
    });

    //On script end, check for errors
    pyshell.end((err) => {
      if(err){
        throw(err);
      }
      res.json(data);
    });
});

/*
  Near: performs the geospatial near query using the lattitude and
  longitude  passed in as parameters.
*/
router.get('/near/:lat/:lng', (req, res) => {
  let data    =   {};
  let images  =   db.get(IMAGES);

  let lat = parseFloat(req.params.lat);
  let lng = parseFloat(req.params.lng);

  images.find({"loc" : {$near:{$geometry:{"type": "Point", "coordinates" : [ lat, lng ] }}}},
              { limit:40  , fields: "pts.loc" }, (err, items) => {
                if(items.length > 0) {
                  data["error"]   =   0;
                  data["Points"]  =   items;
                  res.json(data);
                }
                else {
                  data["error"]   =   1;
                  data["message"]  =   "No Points Found";
                  res.json(data);
                }
              });
});

/*
  Incidence: performs a query on incidence angles using the geospatial within
  mongo query on the angles collection, which uses incidence and emission
  angles as spatial indexes.
  */
router.get('/incidence/:angle', (req, res) => {
  let data    =   {};
  let angles  =   db.get(ANGLES);

  let lat = parseFloat(req.params.angle);
  let lng = 2.49;

  angles.find({"loc" : {$geoWithin:{$box:[[lat,0],[lat,90]]}}},
              { limit:40  , fields: "pts.meta.CENTER_LONGITUDE pts.meta.CENTER_LATITUDE" }, (err, items) => {
                if(items.length > 0) {
                  data["error"]   =   0;
                  data["Points"]  =   items;
                  res.json(data);
                }
                else {
                  data["error"]   =   1;
                  data["message"]  =   "No Images Found";
                  res.json(data);
                }
              });
});

/*
  Image: performs a query for time hyperspectral data associated with a
  image id and point index as specified using url parameters.
*/
router.get('/image/:id/:in', (req, res) => {
  let data    =   {};
  let images  =   db.get(IMAGES);

  // Perform the query on the immages collection
  images.find({_id: req.params.id }, { fields: " pts.ref1 pts.ref2 " }, (err, items) => {
    if(items.length > 0) {
      data["error"]   =   0;
      data["ref1"]  =   items[0].pts[req.params.in].ref1;
      data["ref2"]  =   items[0].pts[req.params.in].ref2;
      res.json(data);
    }

    else {
      // image ID is universally unique, if wasn't in images it could be in angles...
      let angle = db.get(ANGLES)
      angle.find({_id: req.params.id }, { fields: " pts.ref1 pts.ref2 " }, (err, items) => {
        if(items.length > 0) {
          data["error"]   =   0;
          data["ref1"]  =   items[0].pts[req.params.in].ref1;
          data["ref2"]  =   items[0].pts[req.params.in].ref2;
          res.json(data);
        }
        else {
          // ...Or else does not exist
          data["error"]   =   1;
          data["message"]  =   "No Image Found";
          res.json(data);
        }
      });
    }
  });
});

module.exports = router;
