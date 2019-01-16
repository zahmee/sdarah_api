import {
  Router
} from "express";
import invoice from "../model/invoice";
import invoiceDetails from "../model/invoiceDetails";
import {
  authenticate,
  IsAdmin
} from "../middleware/authMiddleware";
import {
  buildExport
} from 'node-excel-export';

export default ({
  config,
  db
}) => {

  let api = Router();


  // v1/invrep
  // ============================================================
  var moment = require('moment');
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
        top: {
          style: "thin",
          color: "FF000000"
        },
        bottom: {
          style: "thin",
          color: "FF000000"
        },
        left: {
          style: "thin",
          color: "FF000000"
        },
        right: {
          style: "thin",
          color: "FF000000"
        }
      }
    },
    english: {
      alignment: {
        readingOrder: 1
      },
      border: {
        top: {
          style: "thin",
          color: "FF000000"
        },
        bottom: {
          style: "thin",
          color: "FF000000"
        },
        left: {
          style: "thin",
          color: "FF000000"
        },
        right: {
          style: "thin",
          color: "FF000000"
        }
      }
    },
    red: {
      fill: {
        fgColor: {
          rgb: 'FFFF0000'
        }
      },
      border: {
        top: {
          style: "thin",
          color: "FF000000"
        },
        bottom: {
          style: "thin",
          color: "FF000000"
        },
        left: {
          style: "thin",
          color: "FF000000"
        },
        right: {
          style: "thin",
          color: "FF000000"
        }
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
      cellStyle: function (value) {
        return (value) ? styles.english : styles.red;
      },
      width: 190 // <- width in pixels 
    },
    billDate: {
      displayName: 'التاريخ',
      headerStyle: styles.headerDark,
      cellFormat: function (value) {
        return moment(value).format("hh:mm:ss a  DD-MM-YYYY  ");
      },
      width: 155,
      cellStyle: styles.normal1,
    },
    total: {
      displayName: 'الاجمالي',
      headerStyle: styles.headerDark,
      cellStyle: function (value) {
        return (value) ? styles.english : styles.red;
      },
      width: 80,
      cellStyle: styles.normal1,
    },
    discount: {
      displayName: 'الخصم',
      headerStyle: styles.headerDark,
      cellStyle: styles.normal1,
      width: 70,
    },
    vat: {
      displayName: 'القيمة المضافة',
      headerStyle: styles.headerDark,
      cellStyle: styles.normal1,
      width: 100,
    },
    net: {
      displayName: 'الصافي',
      headerStyle: styles.headerDark,
      cellStyle: styles.normal1,
      width: 100,
    },
    cash_sales: {
      displayName: 'مبيعات نقدية',
      headerStyle: styles.headerDark,
      cellStyle: styles.normal1,
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
      cellStyle: function (value) {
        return (value) ? styles.normal1 : styles.red;
      },
      width: 100,
      cellFormat: function (value) {
        if (value) {
          return value.length;
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
          return value.name;
        } else {
          return 'نقدي'
        }
      },
      cellStyle: styles.normal1,

    },
    method: {
      displayName: 'نوع الدفع',
      headerStyle: styles.headerDark,
      cellStyle: styles.normal1,
      width: 120,
      cellFormat: function (value) {
        if (value) {
          return value.disc;
        } else {
          return '----'
        }
      }

    }
  }
  // ==============================================================
  // test group by data 
  api.get("/date", (req, res) => {
    var today = moment().add(-5, 'day').startOf('day'); //moment().startOf('day').day(+4) ;
    var tomorrow = moment(today).endOf('day');
    moment.locale("ar");
    /* <==========================================================> */
    invoice.aggregate(
      [
        {
          "$sort": {
            "billDate": 1
          }
        },
        { "$group": { 
          "_id": {  day: { $dayOfMonth: "$billDate" },month: { $month: "$billDate" }, year: { $year: "$billDate" } },
          "total": { $sum:   "$net" },
          "count": { $sum: 1 }
      }},
      ],
      function (err, results) {
        if (err) throw err;
        return res.json(results);
      }
    )
    /* <========================================================>  */
  });

  api.get("/date2", (req, res) => {
    var today = moment().add(-5, 'day').startOf('day'); //moment().startOf('day').day(+4) ;
    var tomorrow = moment(today).endOf('day');
    moment.locale("ar");
    /* <==========================================================> */
    invoice.aggregate(
      [
        {
          $project: {
              month: {$month: "$billDate"}
          }
      },
        {
          $sort : {
            "month": 1
          }
        },
        { "$group": { 
          "_id": "$month" 
      }},
      ],
      function (err, results) {
        if (err) throw err;
        return res.json(results);
      }
    )
    /* <========================================================>  */
  });

  //=============================================================
  // v1/itemsDetails/rep1_exc   -> get all data
  api.get("/rep0_exc", (req, res) => {
    var today = moment().add(-1, 'day').startOf('day'); //moment().startOf('day').day(+4) ;
    var tomorrow = moment(today).endOf('day');
    moment.locale("ar");

    invoice.find({
        billDate: {
          "$gte": today,
          "$lt": tomorrow
        }
      })
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
    var moment = require('moment');
    var today = moment().startOf('day');
    var tomorrow = moment(today).endOf('day');
    moment.locale("ar");

    invoice.find({
        billDate: {
          "$gte": today,
          "$lt": tomorrow
        }
      })
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