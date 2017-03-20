const URL         =   "localhost"
const PORT        =   27017
const DB          =   "selene"
const COLLECTION  =   "images"

const express =   require("express");
const router  =   express.Router();
const monk    =   require("monk");
const db      =   monk(`${URL}:${PORT}/${DB}`);

router.get('/images', (req, res) => {
  let data    =   {};
  let images  =   db.get(COLLECTION);


  images.find({}, { limit:20, fields: "pts.loc pts.ref1 pts.ref2" }, (err, items) => {
    if(items.length > 0) {
      data["error"]   =   0;
      data["Images"]  =   items;
      res.json(data);
    }
    else {
      data["error"]   =   1;
      data["Images"]  =   "No Images Found";
      res.json(data);
    }
  });
});

module.exports = router;
