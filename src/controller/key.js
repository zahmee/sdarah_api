import { Router } from "express";
import Key from "../model/key";
import { generateAccessToken, respond, authenticate, onlyToken,IsAdmin } from "../middleware/authMiddleware";

//import bodyParser from 'body-parser' ;

export default ({ config, db }) => {
  let api = Router();
  // v1/key/add
  api.post("/add", authenticate, IsAdmin ,  (req, res) => {
 
    let newKey = new Key(); 
    newKey.cat.id = req.body.cat.id;
    newKey.cat.cat_name = req.body.cat.cat_name;
    newKey.disc = req.body.disc;
    newKey.is_active = req.body.is_active;
    newKey.save(err => {
      if (err) {
        return res.send(err);
      }
      return res.json({ message: "saved", _id: newKey._id });
    });
  });
  //************************* */
  api.get("/t",  (req, res) => {

    let newKey = new Key();
    newKey.cat.id = 1 ;
    newKey.cat.cat_name = 'ahmed ';
    newKey.disc = 'zahmah';
    newKey.is_active = true ;
    newKey.save(err => {
      if (err) {
        return res.send(err);
      }
      return res.json({ message: "saved" });
    });
  });
  // v1/key/   -> get all data
  api.get("/", (req, res) => {
    Key.find({}, (err, key) => {
      if (err) {
        return res.send(err);
      }
      return res.json(key);
    });
  });
  // /v1/key/:id
  api.get("/:id", (req, res) => {
    Key.findById(req.params.id, (err, key) => {
      if (err) {
        return res.send(err);
      }
      return res.json(key);
    });
  });
  // /v1/key/:id    -- put
  api.put("/:id", authenticate, (req, res) => {
    Key.findById(req.params.id, (err, key) => {
      if (err) {
        res.send(err);
      }
      key.disc = req.body.disc;
      key.is_active = req.body.is_active;
      key.save(err => {
        if (err) {
          return res.send(err);
        }
        return res.json({ message: "update" });
      });
    });
  });
  // /v1/key/:id    -- delete
  api.delete("/:id", authenticate, (req, res) => {
    Key.remove({ _id: req.params.id }, (err, key) => {
      if (err) {
        return res.send(err);
      }
      return res.json({ message: "remove" });
    });
  });
  //====================================================
  return api;
};
