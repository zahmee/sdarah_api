import { Router } from "express";
import itemsDetails from "../model/itemsDetails";
import { authenticate, IsAdmin } from "../middleware/authMiddleware";
import randomID from 'random-id';
import Item from "../model/item";

// const moment = require('moment-timezone');

let id = randomID(13, "0");

let check_id = (req, res, next) => {
  itemsDetails.findOne({ item_detail_id: id }).exec((err, date) => {
    if (err) {
      return res.status(401).send(err);
    }
    if (!date) {
      next();
    }
    else {
      id = randomID(13, "0");
      next();
    }
  }
  );
};

export default ({ config, db }) => {

  let api = Router();

  
  // v1/itemsDetails/add
  api.post("/add", authenticate, check_id, (req, res) => {
    let newRow = new itemsDetails();
    newRow.csBills = req.body.csBills;
    newRow.item = req.body.item;
    newRow.count = req.body.count;
    newRow.buy = req.body.buy;
    newRow.sell = req.body.sell;
    newRow.sell_count = 0;
    newRow.return_count = 0;
    newRow.real_count = req.body.count;
    newRow.item_detail_id = id;
    newRow.last_date_sell = new Date();
    if (req.body.expiration_date) {
      const temp_date = req.body.expiration_date;
      newRow.expiration_date = temp_date.year + '-' + temp_date.month + '-' + temp_date.day;
    }
    newRow.save(err => {
      if (err) {
        return res.send(err);
      } else {
        return res.json({ message: "saved", _id: newRow._id });
      }
    });
  });

  // ======================   invoce   ==============================
  // v1/itemsDetails/invoc
  api.get("/invoc", (req, res) => {
    let size = 20;
    let page = 0;
    let colum = "";
    let text = "";
    (req.query.page) ? page = parseInt(req.query.page) : page = 0;
    (req.query.size) ? size = parseInt(req.query.size) : size = 20;
    (req.query.colum) ? colum = (req.query.colum) : colum = "";
    (req.query.text) ? text = (req.query.text) : text = "";
    let g = Number(text )
    if (Number.isInteger(g)) {
      const query = itemsDetails.findOne({ 'is_active': true, 'item_detail_id': parseInt(text), 'real_count': { $gt: 0 } })
        .populate({
          path: 'csBills',
          select: 'billNo'
        })
        .populate({
          path: 'item',
          select: 'name vat'
        })
        .populate({
          path: 'Key',
          select: 'disc -_id',
        });
      query.exec((err, data) => {
        if (err) {
          return res.send(err);
        }
        if (data) {
          let s = data.toJSON();
          s.add_dirct = true;
          return res.json(s);
        }
        else {
          //<========================>  البحث بحلول أخرى 
          Item.find()
            .where('id').equals(text)
            .exec((err, data) => {
              if (data[0]) {

                // s.add_dirct = false ;
                // <-->   اذا حصل رقم الصنف يحضر جميع الوحدات المدخلة له  <==>
                // console.log(data);
                itemsDetails.find({ 'is_active': true, 'item': data[0]._id, 'real_count': { $gt: 0 } })
                  .populate({
                    path: 'csBills',
                    select: 'billNo'
                  })
                  .populate({
                    path: 'item',
                    select: 'name vat'
                  })
                  .populate({
                    path: 'Key',
                    select: 'disc -_id',
                  }).exec((err, itm_data) => {
                    // console.log(itm_data);
                    if (itm_data.length === 1) {
                      let s = itm_data[0].toJSON();
                      s.add_dirct = true;
                      return res.json(s);
                    } else {
                      return res.json(itm_data);
                    }
                  });
                //==================================================================>><<
              } else {
                const arr = text.split(" ");
                if (arr.length === 1) {
                  Item.find()
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
                  Item.find()
                    .and(serch_arr)
                    .limit(size)
                    .skip(size * page)
                    .exec((err, data) => {
                      return res.json(data);
                    });
                }
              }
            });
          //<==========================================================>
          // return res.json(data);
        }
      });
    } else {
      Item.find()
        .where('id').equals(text)
        .exec((err, data) => {
          if (data[0]) {
            // s.add_dirct = false ;
            // <-->   اذا حصل رقم الصنف يحضر جميع الوحدات المدخلة له  <==>
            console.log(data);
            itemsDetails.find({ 'is_active': true, 'item': data[0]._id, 'real_count': { $gt: 0 } })
              .populate({
                path: 'csBills',
                select: 'billNo'
              })
              .populate({
                path: 'item',
                select: 'name vat'
              })
              .populate({
                path: 'Key',
                select: 'disc -_id',
              }).exec((err, itm_data) => {
                console.log(itm_data);
                if (itm_data.length === 1) {
                  let s = itm_data[0].toJSON();
                  s.add_dirct = true;
                  return res.json(s);
                } else {
                  return res.json(itm_data);
                }
              });
            //==================================================================>><<
          } else {
            const arr = text.split(" ");
            if (arr.length === 1) {
              Item.find()
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
              Item.find()
                .and(serch_arr)
                .limit(size)
                .skip(size * page)
                .exec((err, data) => {
                  return res.json(data);
                });
            }
          }
        });
    }

  });
  

  // v1/itemsDetails/:id   -> get all data
  api.get("/:id", (req, res) => {
    itemsDetails.find({ csBills: req.params.id }).populate({
      path: 'item',
      select: 'name _id',
    }).exec((err, data) => {
      if (err) {
        return res.send(err);
      }
      return res.json(data);
    });
  });

  // /v1/itemsDetails/:id    -- put
  api.put("/:id", authenticate, (req, res) => {
    itemsDetails.findById(req.params.id, (err, editRow) => {
      if (err) {
        return res.send(err);
      } else {
        editRow.csBills = req.body.csBills;
        editRow.item = req.body.item._id;
        editRow.count = req.body.count;
        editRow.buy = req.body.buy;
        editRow.sell = req.body.sell;
        editRow.real_count = req.body.count;
        editRow.last_date_sell = new Date();
        const temp_date = req.body.expiration_date;
        editRow.expiration_date = temp_date.year + '-' + temp_date.month + '-' + temp_date.day;
        editRow.save(err => {
          if (err) {
            return res.send(err);
          } else {
            return res.json({ message: "update" });
          }
        });
      }
    });
  });

  // /v1/itemsDetails/:id    -- delete
  api.delete("/:id", authenticate, (req, res) => {
    itemsDetails.remove({ _id: req.params.id }, (err, key) => {
      if (err) {
        return res.send(err);
      }
      return res.json({ message: "remove" });
    });
  });



  return api;
};
