import { Router } from "express";
import branches from "../model/branches";
import { authenticate, IsAdmin } from "../middleware/authMiddleware";

//import bodyParser from 'body-parser' ;

export default ({ config, db }) => {
  let api = Router();
  // v1/branches/add
  api.post("/add", authenticate, IsAdmin ,  (req, res) => {
 
    let newbranches = new branches(); 
    newbranches.name = req.body.name;
    newbranches.url = req.body.url;
    newbranches.tokin = req.body.tokin;
    newbranches.is_active = req.body.is_active;
    newbranches.save(err => {
      if (err) {
        return res.send(err);
      }
      return res.json({ message: "saved", _id: newbranches._id });
    });
  });
  //************************* */
  // v1/branches/   -> get all data
  // v1/item/   -> get all data
  api.get("/", (req, res) => {
    let size = 20;
    let page = 0;
    let colum = "";
    let text = "";
    (req.query.page) ? page = parseInt(req.query.page) : page = 0;
    (req.query.size) ? size = parseInt(req.query.size) : size = 20;
    (req.query.colum) ? colum = (req.query.colum) : colum = "";
    (req.query.text) ? text = (req.query.text) : text = "";

    if ((colum) && (text)) {
      if (colum === '*') {
        branches.find()
          .where('id').equals(text)
          .exec((err, data) => {
            if (data[0]) {
                let s = data[0].toJSON();
                s.add_dirct = true;
                return res.json(s);
            } else {
              const arr = text.split(" ");
              if (arr.length === 1) {
                branches.find()
                  .or([{ name: { $regex: text, $options: 'i' } }, { id: { $regex: text, $options: 'i' } }])
                  .limit(size)
                  .skip(size * page)
                  .exec((err, data) => {
                    return res.json(data);
                  });
              } else if (arr.length > 1) {
                let serch_arr = [];
                arr.forEach((element) => {
                  serch_arr.push({ name: { $regex: element, $options: 'i' } })
                });
                branches.find()
                  .and(serch_arr)
                  .limit(size)
                  .skip(size * page)
                  .exec((err, data) => {
                    return res.json(data);
                  });
              }
            }
          });

      } else {
        const sst = '{ "' + colum + '": { "$regex": "' + text + '" , "$options": "i" } }';
        branches.count(JSON.parse(sst), (err, countrow) => {
          branches.find(JSON.parse(sst)).limit(size).skip(size * page).exec((err, data) => {
            if (err) {
              return res.send(err);
            }
            data.push({
              'row_count': countrow
            });
            return res.json(data);
          });
        });

      }
    } else {
      branches.count((err, countrow) => {
        branches.find().skip(size * page).limit(size).exec((err, data) => {
          if (err) {
            return res.send(err);
          }
          data.push({
            'row_count': countrow
          });
          return res.json(data);
          return res.json(data);
        });
      });
    }

  });
  // /v1/branches/:id
  api.get("/:id", (req, res) => {
    branches.findById(req.params.id, (err, branches) => {
      if (err) {
        return res.send(err);
      }
      return res.json(branches);
    });
  });
  // /v1/branches/:id    -- put
  api.put("/:id", authenticate, (req, res) => {
    branches.findById(req.params.id, (err, branches) => {
      if (err) {
        res.send(err);
      }
      branches.name = req.body.name;
      branches.url = req.body.url;
      branches.tokin = req.body.tokin;
      branches.is_active = req.body.is_active;
      branches.save(err => {
        if (err) {
          return res.send(err);
        }
        return res.json({ message: "update" });
      });
    });
  });
  // /v1/branches/:id    -- delete
  api.delete("/:id", authenticate, (req, res) => {
    branches.remove({ _id: req.params.id }, (err, branches) => {
      if (err) {
        return res.send(err);
      }
      return res.json({ message: "remove" });
    });
  });
  //====================================================
  return api;
};
