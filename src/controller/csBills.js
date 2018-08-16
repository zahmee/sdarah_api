import { Router } from "express";
import csBills from "../model/csBills";
import { authenticate, IsAdmin } from "../middleware/authMiddleware";
const moment = require('moment-timezone');

export default ({ config, db }) => {
  let api = Router();


  // v1/csbills/add
  api.post("/add", authenticate, (req, res) => {
    let newRow = new csBills();
    newRow.people = req.body.people;
    newRow.method = req.body.method;
    newRow.billNo = req.body.billNo;
    newRow.total = req.body.total;
    newRow.discount = req.body.discount;
    newRow.net = req.body.net;
    const inv_date = req.body.inv_date_d;
    newRow.billDate = inv_date.year + '-' + inv_date.month + '-' + inv_date.day;
    newRow.dateOfPayment = req.body.dateofpayment;
    newRow.assignedTo = req.body.assignedto;
    newRow.memo = req.body.memo;
    newRow.is_active = req.body.is_active;
    newRow.debit_credit_id = req.body.debit_credit_id;
    newRow.debit_credit_dis = req.body.debit_credit_dis;
    newRow.billtype = req.body.billtype;
    newRow.vat = req.body.vat;
    newRow.save(err => {
      if (err) {
        res.send(err);
      } else {
        res.json({ message: "saved", _id: newRow._id });
      }
    });
  });


  // v1/csbills/   -> get all data
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
      csBills.count(JSON.parse(sst), (err, countrow) => {
        if (countrow) {
          csBills.find(JSON.parse(sst)).populate({
            path: 'people',
            select: 'name -_id',
            options: {
              limit: size,
              skip: size * page
            }
          }).select({
            "people": 1,
            "billNo": 1,
            "net": 1,
          }).exec((err, data) => {
            if (err) {
              res.send(err);
            }
            data.push({
              'row_count': (countrow) ? countrow : 0
            });
            res.json(data);
          });
        } else {
          res.json([{ row_count: 0 }]);
        }
      });
    } else {
      csBills.count((err, countrow) => {
        const query = csBills.find().populate({
          path: 'people',
          select: 'name -_id',
          options: {
            limit: size,
            skip: size * page
          }
        }).select({
          "people": 1,
          "billNo": 1,
          "net": 1,
        });
        query.exec((err, data) => {
          if (err) {
            res.send(err);
          }
          data.push({
            'row_count': countrow
          });
          res.json(data);
        });
      });
    }
  });

  // v1/csbills/   -> get all data
  api.get("/coded", (req, res) => {
    csBills.count({ 'is_active': true, 'is_open': true, }, (err, countrow) => {
      const query = csBills.find({ 'is_active': true, 'is_open': true, }).populate({
        path: 'people',
        select: 'name -_id',
      }).populate({
        path: 'method',
        select: 'disc -_id',
      }).populate({
        path: 'billtype',
        select: 'disc -_id',
      }).select({
        "people": 1,
        "method": 1,
        "billtype": 1,
        "billNo": 1,
        "net": 1,
        "debit_credit_dis": 1,
      });
      query.exec((err, data) => {
        if (err) {
          res.send(err);
        }
        data.push({
          'row_count': countrow
        });
        res.json(data);
      });
    });
  });
  // v1/csbills/:id   -> get one row
  api.get("/coded/:id", (req, res) => {
    const query = csBills.findById(req.params.id).populate({
      path: 'people',
      select: 'name -_id',
    }).populate({
      path: 'method',
      select: 'disc -_id',
    }).populate({
      path: 'billtype',
      select: 'disc -_id',
    }).select({
      "people": 1,
      "method": 1,
      "billtype": 1,
      "billNo": 1,
      "net": 1,
      "debit_credit_dis": 1,
    });
    query.exec((err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.json(data);
      }
    });

  });
  // v1/csbills/:id    git 1 csBill row
  api.get("/:id", (req, res) => {
    csBills.findById(req.params.id, (err, row) => {
      if (err) {
        res.send(err);
      } else {
        row.billDate = moment.tz(row.billDate, "Asia/Riyadh");
        res.json(row);
      }
    })
  });


  // /v1/csBills/:id    -- put
  api.put("/:id", authenticate, (req, res) => {
    csBills.findById(req.params.id, (err, editRow) => {
      if (err) {
        res.send(err);
      } else {
        editRow.people = req.body.people;
        editRow.method = req.body.method;
        editRow.billNo = req.body.billNo;
        editRow.total = req.body.total;
        editRow.discount = req.body.discount;
        editRow.net = req.body.net;
        const inv_date = req.body.inv_date_d;
        editRow.billDate = inv_date.year + '-' + inv_date.month + '-' + inv_date.day;
        editRow.dateOfPayment = req.body.dateofpayment;
        editRow.assignedTo = req.body.assignedto;
        editRow.memo = req.body.memo;
        editRow.is_active = req.body.is_active;
        editRow.debit_credit_id = req.body.debit_credit_id;
        editRow.debit_credit_dis = req.body.debit_credit_dis;
        editRow.billtype = req.body.billtype;
        editRow.vat = req.body.vat;
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

  // /v1/csBills/:id    -- put
  api.put("/close/:id", authenticate, (req, res) => {
    csBills.findById(req.params.id, (err, editRow) => {
      if (err) {
        res.send(err);
      } else {
        editRow.is_open = false ;
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

  // /v1/csBills/:id    -- delete
  api.delete("/:id", authenticate, (req, res) => {
    csBills.remove({ _id: req.params.id }, (err, key) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "remove" });
    });
  });
  //====================================================

  return api;
};
