import { Router } from "express";
import People from "../model/people";
import { authenticate, IsAdmin } from "../middleware/authMiddleware";

export default ({ config, db }) => {
  let api = Router();

  // v1/peoples/add
  api.post("/add", authenticate, (req, res) => {
    let newRow = new People();
    newRow.name = req.body.name;
    newRow.cat_id = req.body.cat_id;
    if (req.body.cat_id === "1") {
      newRow.cat_dis = "عميل";
    } else {
      newRow.cat_dis = "مورد";
    }
    newRow.manager = req.body.manager;
    newRow.mobile = req.body.mobile;
    newRow.address = req.body.address;
    newRow.bankname = req.body.bankname;
    newRow.accountno = req.body.accountno;
    newRow.memo = req.body.memo;
    newRow.tel = req.body.tel;
    newRow.is_active = req.body.is_active;
    newRow.maxOrder = req.body.maxOrder;
    newRow.save(err => {
      if (err) {
        res.send(err);
      } else {
        res.json({ message: "saved", _id: newRow._id });
      }
    });
  });


  // v1/peoples/   -> get all data
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
      const sst = '{ "' + colum + '": { "$regex": "' + text + '" , "$options": "i" } }';
      People.count(JSON.parse(sst), (err, countrow) => {
        People.find(JSON.parse(sst), (err, data) => {
          if (err) {
            res.send(err);
          }
          data.push({
            'row_count': countrow
          });
          res.json(data);
        }).limit(size).skip(size * page);
      });
    } else {
      People.count((err, countrow) => {
        People.find((err, data) => {
          if (err) {
            res.send(err);
          }
          data.push({
            'row_count': countrow
          });
          res.json(data);
        }).limit(size).skip(size * page);
      });

    }

  });


  // /v1/peoples/:id    -- put
  api.put("/:id", authenticate, (req, res) => {
    People.findById(req.params.id, (err, editRow) => {
      if (err) {
        res.send(err);
      } else {
        editRow.name = req.body.name;
        editRow.cat_id = req.body.cat_id;
        if (req.body.cat_id === "1") {
          editRow.cat_dis = "عميل";
        } else {
          editRow.cat_dis = "مورد";
        }
        editRow.manager = req.body.manager;
        editRow.mobile = req.body.mobile;
        editRow.address = req.body.address;
        editRow.bankname = req.body.bankname;
        editRow.accountno = req.body.accountno;
        editRow.memo = req.body.memo;
        editRow.tel = req.body.tel;
        editRow.is_active = req.body.is_active;
        editRow.maxOrder = req.body.maxOrder;
        editRow.save(err => {
          if (err) {
            res.send(err);
          } else {
            res.json({ message: "update" });
          }
        });
      }
    });
  });


  // /v1/Peoples/:id    -- delete
  api.delete("/:id", authenticate, (req, res) => {
    People.remove({ _id: req.params.id }, (err, row) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "remove" });
    });
  });
  //====================================================

  return api;
};
