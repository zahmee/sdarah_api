import { Router } from 'express';
import exchangeCustody from '../model/exchangeCustody';
import exchangeCustodyDetails from '../model/exchangeCustodyDetails';
import { authenticate, IsAdmin } from '../middleware/authMiddleware';
import v4 from 'uuid/v4';
import { buildExport } from 'node-excel-export';

export default () => {
  let api = Router();
  // v1/invoice/add
  api.post('/add', authenticate, (req, res) => {
    let newRow = new exchangeCustody();
    newRow.branches = req.body.branches.id;
    newRow.branches_name = req.body.branches.name;
    newRow.state.id = 1;
    newRow.state.disc = 'مرحلة الادخال';
    newRow.save(err => {
      if (err) {
        return res.send(err);
      } else {
        req.body.invDataRow.forEach(el => {
          let newDetialRow = new exchangeCustodyDetails();
          newDetialRow.exchangeCustody = newRow._id;
          newDetialRow.item = el._id;
          newDetialRow.item_id = el.item_id;
          newDetialRow.item_name = el.item_name;
          newDetialRow.count = el.count;
          newDetialRow.save(err => {
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
  api.get('/all', (req, res) => {
    exchangeCustody.count(
      { is_active: true, 'state.id': { $ne: 9 } },
      (err, countrow) => {
        const query = exchangeCustody.find({
          is_active: true,
          'state.id': { $ne: 9 }
        });
        query.exec((err, data) => {
          if (err) {
            return res.send(err);
          }
          data.push({
            row_count: countrow
          });
          return res.json(data);
        });
      }
    );
  });
  //test
  api.get('/test', (req, res) => {
    console.log(v4());
    return res.json({ message: v4() });
  });
  // <=================================================>
  // v1/itemsDetails/:id   -> get  data for noe custody
  api.get('/:id', (req, res) => {
    const master = exchangeCustody.findOne({
      _id: req.params.id,
      is_active: true,
      'state.id': { $ne: 9 }
    });
    const detial = exchangeCustodyDetails.find({
      exchangeCustody: req.params.id
    });
    master.exec((err, data) => {
      if (err) {
        return res.send(err);
      }
      detial.exec((err, data2) => {
        if (err) {
          return res.send(err);
        }
        let exp = {};
        exp['data'] = data2;
        exp['master'] = data;
        return res.json(exp);
      });
    });
  });

  // edit exchange <==========================================
  api.put('/:id', authenticate, (req, res) => {
    exchangeCustodyDetails.remove(
      { exchangeCustody: req.params.id },
      (err, key) => {
        if (err) {
          res.send(err);
        } else {
          const master = exchangeCustody.findOne({
            _id: req.params.id,
            is_active: true,
            'state.id': { $ne: 9 }
          });
          master.exec((err, newRow) => {
            if (err) {
              return res.send(err);
            } else {
              newRow.branches = req.body.branches.id;
              newRow.branches_name = req.body.branches.name;
              newRow.state.id = 1;
              newRow.state.disc = 'مرحلة الادخال';
              newRow.save(err => {
                if (err) {
                  res.send(err);
                } else {
                  req.body.invDataRow.forEach(el => {
                    let newDetialRow = new exchangeCustodyDetails();
                    newDetialRow.exchangeCustody = newRow._id;
                    newDetialRow.item = el._id;
                    newDetialRow.item_id = el.item_id;
                    newDetialRow.item_name = el.item_name;
                    newDetialRow.count = el.count;
                    newDetialRow.save(err => {
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
      }
    );
  });

  // sing exchange <==========================================
  api.put('/singexchange/:id', (req, res) => {
    const master = exchangeCustody.findOne({
      _id: req.params.id,
      is_active: true,
      'state.id': { $ne: 9 }
    });
    master.exec((err, newRow) => {
      if (err) {
        return res.send(err);
      } else {
        newRow.state.id = 2;
        newRow.state.disc = 'مرحلة ارسال البيانات';
        (newRow.signature = v4()), (newRow.signature_date = new Date()); //Date.now ,
        newRow.save(err => {
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
  api.put('/unsingexchange/:id', (req, res) => {
    const master = exchangeCustody.findOne({
      _id: req.params.id,
      is_active: true,
      'state.id': { $ne: 9 }
    });
    master.exec((err, newRow) => {
      if (err) {
        return res.send(err);
      } else {
        newRow.state.id = 1;
        newRow.state.disc = 'مرحلة الادخال';
        newRow.signature = '';
        newRow.signature_date = '';
        newRow.save(err => {
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
  api.get('/excel1/:id', (req, res) => {
    const master = exchangeCustody.findOne({
      _id: req.params.id
    });
    const detial = exchangeCustodyDetails.find({
      exchangeCustody: req.params.id
    });
    master.exec((err, data) => {
      if (err) {
        return res.send(err);
      }
      detial.exec((err, data2) => {
        if (err) {
          return res.send(err);
        }
        //#region *******************   excel file create  *********************
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
        const heading = [
          [{ value: ' تقرير تحويل رصيد ', style: styles.headerDark }],
          [data.branches_name, '0', 'الفرع'],
          [data.billDate, '0', 'تاريخ العملية'],
          [data.signature, '0.', 'التوقيع'],
          [data.signature_date, '0', 'تاريخ التوقيع']
        ];
        const specification = {
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
        const merges = [
          { start: { row: 1, column: 1 }, end: { row: 1, column: 3 } },
          { start: { row: 2, column: 1 }, end: { row: 2, column: 2 } },
          { start: { row: 3, column: 1 }, end: { row: 3, column: 2 } },
          { start: { row: 4, column: 1 }, end: { row: 4, column: 2 } },
          { start: { row: 5, column: 1 }, end: { row: 5, column: 2 } }
        ];
        res.attachment('excel_report.xlsx');
        const report = buildExport([
          // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
          {
            name: 'اصناف الفاتورة',
            heading: heading,
            merges: merges,
            specification: specification,
            data: data2
          }
        ]);
        return res.send(report);
        //#endregion  ***************  excel file end  ****************
      });
    });
  });
  return api;
};
