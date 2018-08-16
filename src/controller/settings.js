import { Router } from "express";
import Settings from "../model/settings";
import { respond, authenticate, IsAdmin } from "../middleware/authMiddleware";

export default ({ config, db }) => {
    let api = Router();


    //   v1/settings/              ->   git settings
    // authenticate, IsAdmin,
    api.get("/",  (req, res) => {
        Settings.countDocuments({}, (err,c )=>{
            if (err) {
                res.send(err);
            } else {
               // res.json(allusers);
               if (c===0 ){
                   let newSetting = new Settings();
                   newSetting.name = 'اسم الفرع ' ;
                   newSetting.save(err => {
                       if (err) {
                           res.send(err);
                       }
                       res.json( newSetting );
                   });
               } else {
                   Settings.findOne({}, function (err, doc) {
                       res.json(doc) ;
                   });
               }
               
            }
        });
    });
 
    // /v1/users/:id    --> edit user data
    api.put("/", authenticate, IsAdmin ,  (req, res) => {
        Settings.findOne({}, (err, general) => {
            if (err) {
                res.send(err);
            }
            general.name = req.body.name;
            general.vat = req.body.vat;
            general.tel = req.body.tel;
            general.memo = req.body.memo;
            general.address = req.body.address;
            general.branch_no = req.body.branch_no;
            general.main_branch = req.body.main_branch;
            general.vat_ok = req.body.vat_ok; 
            general.vat_rate = req.body.vat_rate;
            general.vat_for_all = req.body.vat_for_all;
            general.expiration_date_required = req.body.expiration_date_required;
            general.direct_sale = req.body.direct_sale;
            general.has_discount = req.body.has_discount;
            general.discount_rate = req.body.discount_rate;
            general.sell_old_first = req.body.sell_old_first;
            general.short_invoice = req.body.short_invoice;
            
            general.save(err => {
                if (err) {
                    res.send(err);
                }
                res.json({ message: "update" });
            });
        });
    });
    // <========================================================> \\
    return api;
};
