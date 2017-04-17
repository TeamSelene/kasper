const URL         =   "localhost"
const PORT        =   27017
const DB          =   "selene"
const IMAGES      =   "images"
const ANGLES      =   "image_angles"

const express =   require("express");
const router  =   express.Router();
const monk    =   require("monk");
const db      =   monk(`${URL}:${PORT}/${DB}`);

router.get('/points', (req, res) => {
  let data    =   {};
  let images  =   db.get(IMAGES);


  images.find({}, { limit:100  , fields: "pts.loc" }, (err, items) => {
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

router.get('/incidence/:angle', (req, res) => {
  let data    =   {};
  let angles  =   db.get(ANGLES);

  let lat = parseFloat(req.params.angle);
  let lng = 2.49;

  angles.find({"loc" : {$near:{$geometry:{"type": "Point", "coordinates" : [ lat, lng ] }}}},
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

router.get('/query/:qry', (req, res) => {
  let data    =   {};
  let images  =   db.get(IMAGES);

  let qry = JSON.parse(req.params.qry);

    images.find(qry, { limit:40  , fields: "pts.loc" }, (err, items) => {
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

router.get('/image/:id/:in', (req, res) => {
  let data    =   {};
  let images  =   db.get(IMAGES);


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
