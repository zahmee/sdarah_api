import { Router } from "express";
import Account from "../model/account";
// import passport from "passport";
// import config from "../config/";

import { respond, authenticate, IsAdmin } from "../middleware/authMiddleware";

export default ({ config, db }) => {
    let api = Router();


    //   v1/users/              ->   git all users
    api.get("/", authenticate, IsAdmin, (req, res) => {
        Account.find({}, (err,allusers)=>{
            if (err) {
                res.send(err);
            }
            res.json(allusers);
        });
    });

    // v1/users/:id            -> delete user by id
    api.delete("/:id", authenticate, IsAdmin, (req, res) => {
        Account.remove({ _id: req.params.id }, (err, user) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: "remove" });
        });
    });

    // /v1/users/:id    --> edit user data
    api.put("/:id", authenticate, IsAdmin ,  (req, res) => {
        Account.findById(req.params.id, (err, user) => {
            if (err) {
                res.send(err);
            }
            user.name = req.body.name;
            user.username = req.body.username;
            user.mobile = req.body.mobile;
            user.admin = req.body.admin;
            user.superadmin = req.body.superadmin;
            user.save(err => {
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
