import { Router } from "express";
import itemsDetails from "../model/itemsDetails";
import { authenticate, IsAdmin } from "../middleware/authMiddleware";
import csBills from "../model/csBills";
import { buildExport } from 'node-excel-export';

export default ({ config, db }) => {

  let api = Router();

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

  api.get("/excel1/:id", (req, res) => { 
    let inv = [] ;
    let itm = [] ;
    const query = csBills.find({ '_id': req.params.id  }).populate({
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
        inv = data ;
        itemsDetails.find({ csBills: req.params.id }).populate({
          path: 'item',
          select: 'name _id',
        }).exec((err, data) => {
          if (err) {
            return res.send(err);
          }
          itm = data ;
          //return res.json(data);
          // ================== excle file start

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
            normal2: {
              border: {
                top: { style: "thin", color: "FF000000" },
                bottom: { style: "thin", color: "FF000000" },
                left: { style: "thin", color: "FF000000" },
                right: { style: "thin", color: "FF000000" }
              }
            },
            num: {
              numFmt : "0" ,
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
            [ {value : ' تقرير بمدخلات الفاتورة ' , style: styles.headerDark  } ],
            [ inv[0].people.name , '0' , 'اسم العميل / المورد' ]  ,
            [ inv[0].method.disc, '0' , 'طريقة الدفع' ] ,
            [ inv[0].billNo ,'0.',   'رقم الفاتورة'] ,
            [ inv[0].net, '0' ,  'صافي الفاتورة'  ] ,
            [ inv[0].debit_credit_dis , '0' ,  'دائن/ مدين'  ] ,
            [ inv[0].billtype.disc, '0' ,  'نوع الفاتورة'  ] 
          ];
    
          const specification = {
            item_detail_id : {
              displayName: 'رقم الصنف',
              headerStyle: styles.headerDark, // <- Header style 
              cellStyle: styles.num ,
              width: 120 // <- width in pixels 
            },
            item: {
              displayName: 'اسم الصنف',
              headerStyle: styles.headerDark,
              cellFormat: function (value) { return (value.name) },
              cellStyle: styles.normal2 ,
              width: 320 
            },

            count: {
              displayName: 'الكمية',
              headerStyle: styles.headerDark,
              cellStyle: styles.normal2 ,
              width: 100
            },
            buy: {
              displayName: 'المشترى',
              headerStyle: styles.headerDark,
              width: 90,
              cellStyle: styles.normal2
            },
            sell: {
              displayName: 'البيع',
              headerStyle: styles.headerDark,
              width: 120,
              cellStyle: styles.normal2 
            },
            expiration_date: {
              displayName: 'تاريخ الصلاحية',
              headerStyle: styles.headerDark,
              cellStyle: function (value) { return (value || value === 0) ? styles.normal1 : styles.red; },
              cellFormat: function (value) { return (value || value === 0) ? value : "*"; },
              width: 150
            }    
          }
    
          const merges = [
            { start: { row: 1, column: 1 }, end: { row: 1, column: 6 } } ,
            { start: { row: 2, column: 1 }, end: { row: 2, column: 2 } } ,
            { start: { row: 2, column: 3 }, end: { row: 2, column: 6 } } ,
            { start: { row: 3, column: 1 }, end: { row: 3, column: 2 } } ,
            { start: { row: 3, column: 3 }, end: { row: 3, column: 6 } } ,
            { start: { row: 4, column: 3 }, end: { row: 4, column: 6 } } ,
            { start: { row: 4, column: 1 }, end: { row: 4, column: 2 } } ,
            { start: { row: 5, column: 3 }, end: { row: 5, column: 6 } } ,
            { start: { row: 5, column: 1 }, end: { row: 5, column: 2 } } ,
            { start: { row: 6, column: 3 }, end: { row: 6, column: 6 } } ,
            { start: { row: 6, column: 1 }, end: { row: 6, column: 2 } } ,
            { start: { row: 7, column: 3 }, end: { row: 7, column: 6 } } ,
            { start: { row: 7, column: 1 }, end: { row: 7, column: 2 } } 
          ]
    
          res.attachment('excel_report.xlsx');
          const report = buildExport(
            [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report 
              {
                name: 'اصناف الفاتورة',
                heading: heading,
                merges: merges,
                specification: specification,
                data: itm
              }
            ]
    
          );
          return res.send(report);

          // *****************  excel file end 
        });
    });

      
    /*

    */
  });

 
  return api;
};
