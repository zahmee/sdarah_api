import { Router } from "express";
import Item from "../model/item";
import Key from "../model/key";

import { authenticate, IsAdmin } from "../middleware/authMiddleware";
import { buildExport } from 'node-excel-export';

export default ({ config, db }) => {
  let api = Router();


  // v1/item/add
  api.post("/add", authenticate, (req, res) => {
    let newItem = new Item();
    newItem.id = req.body.id;
    newItem.name = req.body.name;
    newItem.cat = req.body.cat;
    newItem.unit = req.body.unit;
    newItem.place = req.body.place;
    newItem.sell = req.body.sell;
    newItem.buy = req.body.buy;
    newItem.max_order = req.body.max_order;
    newItem.reorder = req.body.reorder;
    newItem.vat = req.body.vat;
    newItem.is_active = req.body.is_active;
    newItem.save(err => {
      if (err) {
        res.send(err);
      } else {
        res.json({ message: "saved", _id: newItem._id });
      }
    });
  });


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
        Item.find()
          .where('id').equals(text)
          .exec((err, data) => {
            if (data[0]) {
                let s = data[0].toJSON();
                s.add_dirct = true;
                return res.json(s);
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

      } else {
        const sst = '{ "' + colum + '": { "$regex": "' + text + '" , "$options": "i" } }';
        Item.countDocuments(JSON.parse(sst), (err, countrow) => {
          Item.find(JSON.parse(sst)).limit(size).skip(size * page).exec((err, data) => {
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
      Item.countDocuments((err, countrow) => {
        Item.find().skip(size * page).limit(size).exec((err, data) => {
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

  api.get("/wk", (req, res) => {
    /* 
    Item.findOne({ _id: '5a4e1c91b30ca556e65913ea' }).populate('Key', 'disc').exec( (err, data) => {
      data.cat = Key;
      console.log(data.cat);
      res.send(data.Key.disc);
    }) ;
    */
    Item.findById('5a4e1c91b30ca556e65913ea').populate('cat').populate('unit').exec((err, data) => {
      // data.cat = Key;
      console.log(data);
      console.log(data.cat.disc);
      res.send(data);
    });

  });

  // /v1/items/:id    -- put
  api.put("/:id", authenticate, (req, res) => {
    Item.findById(req.params.id, (err, newItem) => {
      if (err) {
        res.send(err);
      } else {
        newItem.id = req.body.id;
        newItem.name = req.body.name;
        newItem.cat = req.body.cat;
        newItem.unit = req.body.unit;
        newItem.place = req.body.place;
        newItem.sell = req.body.sell;
        newItem.buy = req.body.buy;
        newItem.max_order = req.body.max_order;
        newItem.reorder = req.body.reorder;
        newItem.vat = req.body.vat;
        newItem.is_active = req.body.is_active;
        newItem.save(err => {
          if (err) {
            res.send(err);
          } else {
            res.json({ message: "update" });
          }
        });
      }
    });
  });


  // /v1/items/:id    -- delete
  api.delete("/:id", authenticate, (req, res) => {
    Item.remove({ _id: req.params.id }, (err, key) => {
      if (err) {
        res.send(err);
      } res.json({ message: "remove" });
    });
  });

  //===================================================================================================================
  // ******************************************************************************************************************
  api.get("/exc", (req, res) => {
    Item.find().populate('cat').populate('unit').exec((err, datarow) => {
      const styles = {
        headerDark: {
          fill: {
            fgColor: {
              rgb: 'FF000000'
            }
          },
          font: {
            color: {
              rgb: 'FFFFFFFF'
            },
            sz: 14,
            bold: true
          },
          alignment: {
            vertical: "center",
            horizontal: "center",
            readingOrder: 2
          }
        },
        cellPink: {
          fill: {
            fgColor: {
              rgb: 'FFFFCCFF'
            }
          }
        },
        cellGreen: {
          fill: {
            fgColor: {
              rgb: 'FF00FF00'
            }
          }
        },
        normal1: {
          alignment: {
            vertical: "center",
            horizontal: "center",
            readingOrder: 2
          },
          border: {
            top: { style: "thin", color: "FF000000" },
            bottom: { style: "thin", color: "FF000000" },
            left: { style: "thin", color: "FF000000" },
            right: { style: "thin", color: "FF000000" }
          }
        },
        english: {
          alignment: {
            readingOrder: 1
          },
          border: {
            top: { style: "thin", color: "FF000000" },
            bottom: { style: "thin", color: "FF000000" },
            left: { style: "thin", color: "FF000000" },
            right: { style: "thin", color: "FF000000" }
          }
        },
        red: {
          fill: { fgColor: { rgb: 'FFFF0000' } },
          border: {
            top: { style: "thin", color: "FF000000" },
            bottom: { style: "thin", color: "FF000000" },
            left: { style: "thin", color: "FF000000" },
            right: { style: "thin", color: "FF000000" }
          },
          alignment: {
            vertical: "center",
            horizontal: "center",
            readingOrder: 1
          }
        }
      };

      const heading = [
        [{ value: ' تقرير بالاصناف المدخلة و النواقص في الادخال ', style: styles.headerDark }],
        [{ value: ' جميع الاصناف المدخلة ', style: styles.normal1 }] // <-- It can be only values 
      ];

      const specification = {
        id: {
          displayName: 'رقم الصنف',
          headerStyle: styles.headerDark, // <- Header style 
          cellStyle: function (value) { return (value) ? styles.english : styles.red; },
          width: 120 // <- width in pixels 
        },
        name: {
          displayName: 'اسم الصنف',
          headerStyle: styles.headerDark,
          cellStyle: function (value) { return (value) ? styles.english : styles.red; },
          width: 320,
        },
        cat: {
          displayName: 'الوحدة',
          headerStyle: styles.headerDark,
          cellStyle: function (value) { return (value) ? styles.normal1 : styles.red; },
          width: 80,
          cellFormat: function (value) {
            if (value) {
              return (value.disc);
            } else {
              return '*'
            }
          }
        },
        unit: {
          displayName: 'التصنيف',
          headerStyle: styles.headerDark,
          cellStyle: function (value) { return (value) ? styles.normal1 : styles.red; },
          width: 100,
          cellFormat: function (value) {
            if (value) {
              return (value.disc);
            } else {
              return '*'
            }
          }
        },
        max_order: {
          displayName: 'الحد الاعلى',
          headerStyle: styles.headerDark,
          width: 90,
          cellFormat: function (value) { return (value || value === 0) ? value : "*"; },
          cellStyle: function (value) { return (value || value === 0) ? styles.normal1 : styles.red; },

        },
        reorder: {
          displayName: 'كمية اعادة الطلب',
          headerStyle: styles.headerDark,
          cellStyle: function (value) { return (value || value === 0) ? styles.normal1 : styles.red; },
          width: 120,
          cellFormat: function (value) { return (value || value === 0) ? value : "*"; }

        },
        vat: {
          displayName: 'vat',
          headerStyle: styles.headerDark,
          cellStyle: function (value) { return (value || value === 0) ? styles.normal1 : styles.red; },
          width: 50,
          cellFormat: function (value) { return (value || value === 0) ? value : "*"; }
        },
        is_active: {
          displayName: 'فعال',
          headerStyle: styles.headerDark,
          cellStyle: function (value) { return (value) ? styles.normal1 : styles.red; },
          width: 50,
          cellFormat: function (value) { return (value) ? "نعم" : "لا"; }
        }

      }

      const merges = [
        { start: { row: 1, column: 1 }, end: { row: 1, column: 8 } },
        { start: { row: 2, column: 1 }, end: { row: 2, column: 8 } }
      ]

      res.attachment('report.xlsx');
      const report = buildExport(
        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report 
          {
            name: 'الاصناف المدخلة في النظام',
            heading: heading,
            merges: merges,
            specification: specification,
            data: datarow
          }
        ]

      );

      //excel.Workbook.Views = [{ RTL: true }];
      //excel.Workbook.readingOrder = "LeftToRight" ; //   
      //excel.Workbook.tables.add("A1:D1", true );
      // if (!excel.Workbook) excel.Workbook = {};
      // if (!excel.Workbook.Views) excel.Workbook.Views = [];
      // if (!excel.Workbook.Views[0]) excel.Workbook.Views[0] = {};
      // excel.Workbook.Views[0].RTL = true;
      // You can then return this straight 
      // This is sails.js specific (in general you need to set headers) 
      return res.send(report);
    });
  });

  api.get("/export", (req, res) => {
    Item.find().lean().exec(function (err, users) {
        res.attachment('items.json');
        return res.send(users);
    }) ;
  }) ; 

  return api;
};
