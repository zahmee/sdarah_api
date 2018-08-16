import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import Account from "../model/account";

const TOKENTIME = 60 * 60 * 24 * 356;
const SECRET = "ZaHmEe!1@2 AfMnIsH 1243b";

let authenticate = expressJwt({ secret: SECRET });

let IsAdmin = (req, res, next) => {
    Account.findById(req.user.id, '-__v', (err, user) => {
        if (err) {
            return res.status(401).send(err);
        }
        if (user.admin === true) {
            next();
        }
        else {
            res.end();
        }
    });
};
let generateAccessToken = (req, res, next) => {
    req.token = req.token || {};
    req.token = jwt.sign({
        id: req.user.id,
    }, SECRET, {
            expiresIn: TOKENTIME
        });
    next();
};

let onlyToken = (id) => {
    return jwt.sign({
        id: id,
    }, SECRET, {
            expiresIn: TOKENTIME
        });
};

let respond = (req, res) => {
    res.status(200).json({
        user: req.user.username,
        token: req.token
    });
};


module.exports = {
    authenticate,
    generateAccessToken,
    respond,
    onlyToken,
    IsAdmin
};
