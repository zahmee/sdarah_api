'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _exchangeCustody = require('../model/exchangeCustody');

var _exchangeCustody2 = _interopRequireDefault(_exchangeCustody);

var _exchangeCustodyDetails = require('../model/exchangeCustodyDetails');

var _exchangeCustodyDetails2 = _interopRequireDefault(_exchangeCustodyDetails);

var _authMiddleware = require('../middleware/authMiddleware');

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _nodeExcelExport = require('node-excel-export');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var api = (0, _express.Router)();
  // v1/invoice/add
  api.post('/add', _authMiddleware.authenticate, function (req, res) {
    var newRow = new _exchangeCustody2.default();
    newRow.branches = req.body.branches.id;
    newRow.branches_name = req.body.branches.name;
    newRow.state.id = 1;
    newRow.state.disc = 'مرحلة الادخال';
    newRow.save(function (err) {
      if (err) {
        return res.send(err);
      } else {
        req.body.invDataRow.forEach(function (el) {
          var newDetialRow = new _exchangeCustodyDetails2.default();
          newDetialRow.exchangeCustody = newRow._id;
          newDetialRow.item = el._id;
          newDetialRow.item_id = el.item_id;
          newDetialRow.item_name = el.item_name;
          newDetialRow.count = el.count;
          newDetialRow.save(function (err) {
            if (err) {
              return res.send(err);
            }
          });
        });
        return res.json({ message: 'saved', _id: newRow._id });
      }
    });
  });

  // ======================   get all exchanges   ==============================
  api.get('/all', function (req, res) {
    _exchangeCustody2.default.count({ is_active: true, 'state.id': { $ne: 9 } }, function (err, countrow) {
      var query = _exchangeCustody2.default.find({
        is_active: true,
        'state.id': { $ne: 9 }
      });
      query.exec(function (err, data) {
        if (err) {
          return res.send(err);
        }
        data.push({
          row_count: countrow
        });
        return res.json(data);
      });
    });
  });
  //test
  api.get('/test', function (req, res) {
    console.log((0, _v2.default)());
    return res.json({ message: (0, _v2.default)() });
  });
  // <=================================================>
  // v1/itemsDetails/:id   -> get  data for noe custody
  api.get('/:id', function (req, res) {
    var master = _exchangeCustody2.default.findOne({
      _id: req.params.id,
      is_active: true,
      'state.id': { $ne: 9 }
    });
    var detial = _exchangeCustodyDetails2.default.find({
      exchangeCustody: req.params.id
    });
    master.exec(function (err, data) {
      if (err) {
        return res.send(err);
      }
      detial.exec(function (err, data2) {
        if (err) {
          return res.send(err);
        }
        var exp = {};
        exp['data'] = data2;
        exp['master'] = data;
        return res.json(exp);
      });
    });
  });

  // edit exchange <==========================================
  api.put('/:id', _authMiddleware.authenticate, function (req, res) {
    _exchangeCustodyDetails2.default.remove({ exchangeCustody: req.params.id }, function (err, key) {
      if (err) {
        res.send(err);
      } else {
        var master = _exchangeCustody2.default.findOne({
          _id: req.params.id,
          is_active: true,
          'state.id': { $ne: 9 }
        });
        master.exec(function (err, newRow) {
          if (err) {
            return res.send(err);
          } else {
            newRow.branches = req.body.branches.id;
            newRow.branches_name = req.body.branches.name;
            newRow.state.id = 1;
            newRow.state.disc = 'مرحلة الادخال';
            newRow.save(function (err) {
              if (err) {
                res.send(err);
              } else {
                req.body.invDataRow.forEach(function (el) {
                  var newDetialRow = new _exchangeCustodyDetails2.default();
                  newDetialRow.exchangeCustody = newRow._id;
                  newDetialRow.item = el._id;
                  newDetialRow.item_id = el.item_id;
                  newDetialRow.item_name = el.item_name;
                  newDetialRow.count = el.count;
                  newDetialRow.save(function (err) {
                    if (err) {
                      return res.send(err);
                    }
                  });
                });
                return res.json({ message: 'saved', _id: newRow._id });
              }
            });
          }
        });
      }
    });
  });

  // sing exchange <==========================================
  api.put('/singexchange/:id', function (req, res) {
    var master = _exchangeCustody2.default.findOne({
      _id: req.params.id,
      is_active: true,
      'state.id': { $ne: 9 }
    });
    master.exec(function (err, newRow) {
      if (err) {
        return res.send(err);
      } else {
        newRow.state.id = 2;
        newRow.state.disc = 'مرحلة ارسال البيانات';
        newRow.signature = (0, _v2.default)(), newRow.signature_date = new Date(); //Date.now ,
        newRow.save(function (err) {
          if (err) {
            res.send(err);
          } else {
            return res.json({ message: 'saved', row: newRow });
          }
        });
      }
    });
  });

  // sing exchange <==========================================
  api.put('/unsingexchange/:id', function (req, res) {
    var master = _exchangeCustody2.default.findOne({
      _id: req.params.id,
      is_active: true,
      'state.id': { $ne: 9 }
    });
    master.exec(function (err, newRow) {
      if (err) {
        return res.send(err);
      } else {
        newRow.state.id = 1;
        newRow.state.disc = 'مرحلة الادخال';
        newRow.signature = '';
        newRow.signature_date = '';
        newRow.save(function (err) {
          if (err) {
            res.send(err);
          } else {
            return res.json({ message: 'saved', row: newRow });
          }
        });
      }
    });
  });

  // print to excel exchange <==========================================
  api.get('/excel1/:id', function (req, res) {
    var master = _exchangeCustody2.default.findOne({
      _id: req.params.id
    });
    var detial = _exchangeCustodyDetails2.default.find({
      exchangeCustody: req.params.id
    });
    master.exec(function (err, data) {
      if (err) {
        return res.send(err);
      }
      detial.exec(function (err, data2) {
        if (err) {
          return res.send(err);
        }
        //#region *******************   excel file create  *********************
        var styles = {
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
              vertical: 'center',
              horizontal: 'center',
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
              vertical: 'center',
              horizontal: 'center',
              readingOrder: 2
            },
            border: {
              top: { style: 'thin', color: 'FF000000' },
              bottom: { style: 'thin', color: 'FF000000' },
              left: { style: 'thin', color: 'FF000000' },
              right: { style: 'thin', color: 'FF000000' }
            }
          },
          normal2: {
            border: {
              top: { style: 'thin', color: 'FF000000' },
              bottom: { style: 'thin', color: 'FF000000' },
              left: { style: 'thin', color: 'FF000000' },
              right: { style: 'thin', color: 'FF000000' }
            }
          },
          num: {
            numFmt: '0',
            border: {
              top: { style: 'thin', color: 'FF000000' },
              bottom: { style: 'thin', color: 'FF000000' },
              left: { style: 'thin', color: 'FF000000' },
              right: { style: 'thin', color: 'FF000000' }
            }
          },
          english: {
            alignment: {
              readingOrder: 1
            },
            border: {
              top: { style: 'thin', color: 'FF000000' },
              bottom: { style: 'thin', color: 'FF000000' },
              left: { style: 'thin', color: 'FF000000' },
              right: { style: 'thin', color: 'FF000000' }
            }
          },
          red: {
            fill: { fgColor: { rgb: 'FFFF0000' } },
            border: {
              top: { style: 'thin', color: 'FF000000' },
              bottom: { style: 'thin', color: 'FF000000' },
              left: { style: 'thin', color: 'FF000000' },
              right: { style: 'thin', color: 'FF000000' }
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              readingOrder: 1
            }
          }
        };
        var heading = [[{ value: ' تقرير تحويل رصيد ', style: styles.headerDark }], [data.branches_name, '0', 'الفرع'], [data.billDate, '0', 'تاريخ العملية'], [data.signature, '0.', 'التوقيع'], [data.signature_date, '0', 'تاريخ التوقيع']];
        var specification = {
          item_id: {
            displayName: 'رقم الصنف',
            headerStyle: styles.headerDark, // <- Header style
            cellStyle: styles.num,
            width: 120 // <- width in pixels
          },
          item_name: {
            displayName: 'اسم الصنف',
            headerStyle: styles.headerDark,
            cellStyle: styles.normal2,
            width: 420
          },
          count: {
            displayName: 'الكمية',
            headerStyle: styles.headerDark,
            cellStyle: styles.normal2,
            width: 150
          }
        };
        var merges = [{ start: { row: 1, column: 1 }, end: { row: 1, column: 3 } }, { start: { row: 2, column: 1 }, end: { row: 2, column: 2 } }, { start: { row: 3, column: 1 }, end: { row: 3, column: 2 } }, { start: { row: 4, column: 1 }, end: { row: 4, column: 2 } }, { start: { row: 5, column: 1 }, end: { row: 5, column: 2 } }];
        res.attachment('excel_report.xlsx');
        var report = (0, _nodeExcelExport.buildExport)([
        // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
        {
          name: 'اصناف الفاتورة',
          heading: heading,
          merges: merges,
          specification: specification,
          data: data2
        }]);
        return res.send(report);
        //#endregion  ***************  excel file end  ****************
      });
    });
  });
  return api;
};
//# sourceMappingURL=exchangeCustody.js.map