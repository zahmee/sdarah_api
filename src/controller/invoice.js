import { Router } from "express";
import invoice from "../model/invoice";
import counter from "../model/counter";
import invoiceDetails from "../model/invoiceDetails";
import { authenticate, IsAdmin } from "../middleware/authMiddleware";
import { buildExport } from 'node-excel-export';



export default ({ config, db }) => {

  let api = Router();


  api.get("/it", (req, res) => {
    const sequenceDoc = getValueForNextSequence("inv_no") ;
    console.log(sequenceDoc )
    return res.json({ message: "saved", _id: '00'  });
    
    /*
   
    
    const sequenceDoc = counter.findOneAndUpdate(
      { seq_name: 'inv_no' },
      { $inc: { sequence_value: 1 } },
      { //options
        new: true,
      },
      (err, bot) => {
        if (err) {
          let co = new counter();
          co.seq_name = 'inv_no';
          co.sequence_value = 0;
          co.save(err => {
            if (err) {
              return res.send(err);
            }
            return 0 ;
          });
        }
        return  bot.sequence_value ;
      }
      
    );
    */
  }) ;
  function getValueForNextSequence(sequenceOfName) {
    const sequenceDoc = counter.findOneAndUpdate(
      { seq_name: sequenceOfName },
      { $inc: { sequence_value: 1 } },
      { new: true  },
      (err, bot) => {
        if (err) {
          let co = new counter();
          co.seq_name = sequenceOfName ;
          co.sequence_value = 0;
          co.save(err => {
            if (err) {
              return res.send(err);
            }
            return 0;
          });
        }
        return bot.sequence_value;
      }
    );
    //console.log(sequenceDoc.sequence_value)
    return sequenceDoc.sequence_value ;
  }

  // v1/invoice/add
  api.post("/add", authenticate, (req, res) => {
    let newRow = new invoice();
    newRow.cash_sales = (req.body.peopelSelected === 100) ? true : false;
    newRow.people = req.body.peopelSelected_id;
    newRow.method = req.body.payway;
    newRow.total = req.body.invTotal;
    newRow.discount = req.body.dicount;
    newRow.vat = req.body.invVAT;
    newRow.net = req.body.invNetTotal;
    newRow.is_active = true;
    newRow.assignedTo = req.user.id;
    newRow.items = req.body.invDataRow;
    newRow.inv_no = 1 ;
    newRow.save(err => {
      if (err) {
        return res.send(err);
      } else {
        req.body.invDataRow.forEach((el) => {
          let newDetialRow = new invoiceDetails();
          newDetialRow.invoice = newRow._id;
          newDetialRow.item = el._id;
          newDetialRow.item_id = el.item_id;
          newDetialRow.sell = el.sell;
          newDetialRow.count = el.count;
          newDetialRow.total = el.total;
          if (el.vat) {
            newDetialRow.vat = el.vat;
            newDetialRow.net = el.total + (el.vat * el.total);
          } else {
            newDetialRow.vat = 0;
            newDetialRow.net = el.total + (0.0 * el.total);
          }
          newDetialRow.save(err => {
            if (err) {
              return res.send(err);
            }
          });
        });
        return res.json({ message: "saved", _id: newRow._id, inv_no: '1' });
      }
    })
  });

    /*
    counter.findOneAndUpdate(
      { seq_name: 'inv_no' },
      { $inc: { sequence_value: 1 } },
      { new: true },
      (err, bot) => {
        if (err) {
          let co = new counter();
          co.seq_name = sequenceOfName;
          co.sequence_value = 1;
          co.save(err => {
            if (err) {
              return res.send(err);
            }
            //--------------------------------------------------------------
            newRow.inv_no = 1 ;
            newRow.save(err => {
              if (err) {
                return res.send(err);
              } else {
                req.body.invDataRow.forEach((el) => {
                  let newDetialRow = new invoiceDetails();
                  newDetialRow.invoice = newRow._id;
                  newDetialRow.item = el._id;
                  newDetialRow.item_id = el.item_id;
                  newDetialRow.sell = el.sell;
                  newDetialRow.count = el.count;
                  newDetialRow.total = el.total;
                  if (el.vat) {
                    newDetialRow.vat = el.vat;
                    newDetialRow.net = el.total + (el.vat * el.total);
                  } else {
                    newDetialRow.vat = 0;
                    newDetialRow.net = el.total + (0.0 * el.total);
                  }
                  newDetialRow.save(err => {
                    if (err) {
                      return res.send(err);
                    }
                  });
                });
                return res.json({ message: "saved", _id: newRow._id , inv_no : '1' });
              }
            })
          });
        }
        //------------------------------------------------------------------
        newRow.inv_no = bot.sequence_value ;
        newRow.save(err => {
          if (err) {
            return res.send(err);
          } else {
            req.body.invDataRow.forEach((el) => {
              let newDetialRow = new invoiceDetails();
              newDetialRow.invoice = newRow._id;
              newDetialRow.item = el._id;
              newDetialRow.item_id = el.item_id;
              newDetialRow.sell = el.sell;
              newDetialRow.count = el.count;
              newDetialRow.total = el.total;
              if (el.vat) {
                newDetialRow.vat = el.vat;
                newDetialRow.net = el.total + (el.vat * el.total);
              } else {
                newDetialRow.vat = 0;
                newDetialRow.net = el.total + (0.0 * el.total);
              }
              newDetialRow.save(err => {
                if (err) {
                  return res.send(err);
                }
              });
            });
            return res.json({ message: "saved", _id: newRow._id, inv_no: bot.sequence_value });
          }
        });

      }
    );
    */

  // });

  // ======================   invoce   ==============================
  // v1/itemsDetails/inv   -> get all data
  api.get("/invoc", (req, res) => {
    const query = itemsDetails.findOne({ 'is_active': true, 'item_detail_id': req.query.item_id , 'real_count': { $gt: 0 } })
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
      }) ; 
      /*.select({
      "buy": 1,
      "csBills": 1,
      "expiration_date": 1,
      "item": 1,
        "item_detail_id": 1,
        "real_count": 1,
        "sell": 1,
        
      }) ; */
    query.exec((err, datarow) => {
      if (err) {
        return res.send(err);
      }
      if (data){
      let s = data.toJSON() ;
      s.add_dirct = true ; 
      return res.json(s);
      }
      else {
        return res.json(data);
      }
    });
  });
  
  var moment = require('moment') ;

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

  const specification = {
    _id: {
      displayName: 'رقم القاتورة',
      headerStyle: styles.headerDark, // <- Header style 
      cellStyle: function (value) { return (value) ? styles.english : styles.red; },
      width: 190 // <- width in pixels 
    },
    billDate: {
      displayName: 'التاريخ',
      headerStyle: styles.headerDark,
      cellFormat: function (value) {
          return moment(value).format("hh:mm:ss a  DD-MM-YYYY  ") ;
      } ,
      width: 155,
      cellStyle: styles.normal1 ,
    },
    total: {
      displayName: 'الاجمالي',
      headerStyle: styles.headerDark,
      cellStyle: function (value) { return (value) ? styles.english : styles.red; },
      width: 80,
      cellStyle: styles.normal1 ,
    },
    discount: {
      displayName: 'الخصم',
      headerStyle: styles.headerDark,
      cellStyle: styles.normal1 ,
      width: 70,
    },
    vat: {
      displayName: 'القيمة المضافة',
      headerStyle: styles.headerDark,
      cellStyle: styles.normal1 ,
      width: 100,
    },
    net: {
      displayName: 'الصافي',
      headerStyle: styles.headerDark,
      cellStyle: styles.normal1 ,
      width: 100,
    },
    cash_sales: {
      displayName: 'مبيعات نقدية',
      headerStyle: styles.headerDark,
      cellStyle:  styles.normal1  ,
      width: 80,
      cellFormat: function (value) {
        if (value) {
          return 'نعم';
        } else {
          return 'لا'
        }
      }
    },
    items: {
      displayName: 'عدد الاصناف',
      headerStyle: styles.headerDark,
      cellStyle: function (value) { return (value) ? styles.normal1 : styles.red; },
      width: 100,
      cellFormat: function (value) {
        if (value) {
          return value.length ;
        } else {
          return 0
        }
      }
    },
    people: {
      displayName: 'العميل',
      headerStyle: styles.headerDark,
      width: 190,
      cellFormat: function (value) { 
        if (value) {
          return value.name ;
        } else {
          return 'نقدي'
        }
       },
      cellStyle: styles.normal1 ,

    },
    method: {
      displayName: 'نوع الدفع',
      headerStyle: styles.headerDark,
      cellStyle: styles.normal1 ,
      width: 120,
      cellFormat: function (value) { 
        if (value) {
          return value.disc ;
        } else {
          return '----'
        }
      }

    }  
  }



  // v1/itemsDetails/rep1_exc   -> get all data
  api.get("/rep0_exc", (req, res) => {
    var today =   moment().add(-1, 'day').startOf('day') ; //moment().startOf('day').day(+4) ;
    var tomorrow =  moment(today).endOf('day') ;
    moment.locale("ar");
    
    invoice.find({ billDate: {"$gte": today , "$lt": tomorrow } })
    .populate({
      path: 'method',
      select: 'disc -_id',
    })
    .populate({
      path: 'assignedTo',
      select: 'name -_id',
    })
    .populate({
      path: 'people',
      select: 'name -_id',
    })
    .exec((err, datarow) => {
      if (err) {
        return res.send(err);
      } else {
        /* ||||     excel file write  start   |||||| */

 

        /*
        const heading = [
          [{ value: ' تقرير الفواتير المباعة ليوم ', style: styles.headerDark }],
          [{ value: today.format("DD-MM-YYYY") , style: styles.normal1 }] // <-- It can be only values 
        ];
        */
 
  /*
        const merges = [
          { start: { row: 1, column: 1 }, end: { row: 1, column: 9 } },
          { start: { row: 2, column: 1 }, end: { row: 2, column: 9 } }
        ]
  */
        res.attachment('report.xlsx');
        const report = buildExport(
          [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report 
            {
              name: 'فواتير اليوم',
              //heading: heading,
              //merges: merges,
              specification: specification,
              data: datarow
            }
          ]
  
        );
  
        return res.send(report);

        //======================== excel file end
        //  return res.json(datarow);
      }
      // return res.json(data);
    });
  });

  api.get("/rep1_exc", (req, res) => {
    var moment = require('moment') ;
    var today =  moment().startOf('day')  ;
    var tomorrow =  moment(today).endOf('day') ;
    moment.locale("ar");
    
    invoice.find({ billDate: {"$gte": today , "$lt": tomorrow } })
    .populate({
      path: 'method',
      select: 'disc -_id',
    })
    .populate({
      path: 'assignedTo',
      select: 'name -_id',
    })
    .populate({
      path: 'people',
      select: 'name -_id',
    })
    .exec((err, datarow) => {
      if (err) {
        return res.send(err);
      } else {
        /* ||||     excel file write  start   |||||| */



        /*
        const heading = [
          [{ value: ' تقرير الفواتير المباعة ليوم ', style: styles.headerDark }],
          [{ value: today.format("DD-MM-YYYY") , style: styles.normal1 }] // <-- It can be only values 
        ];
        */

  /*
        const merges = [
          { start: { row: 1, column: 1 }, end: { row: 1, column: 9 } },
          { start: { row: 2, column: 1 }, end: { row: 2, column: 9 } }
        ]
  */
        res.attachment('report.xlsx');
        const report = buildExport(
          [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report 
            {
              name: 'فواتير اليوم',
              //heading: heading,
              //merges: merges,
              specification: specification,
              data: datarow
            }
          ]
  
        );
  
        return res.send(report);

        //======================== excel file end
        //  return res.json(datarow);
      }
      // return res.json(data);
    });
  });
  return api;
};
