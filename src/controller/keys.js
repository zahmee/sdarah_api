import { Router } from "express";
import Key from "../model/key";
//import mongoose from "mongoose";
//import bodyParser from 'body-parser' ;

export default ({ config, db }) => {
    let api = Router();
    // v1/keys/   -> get all data
    api.get("/", (req, res) => {
        Key.find({}, (err, key) => {
            if (err) {
                res.send(err);
            }
            res.json(key);
        });
    });
    // /v1/keys/:id
    api.get("/:id", (req, res) => {
        Key.find({"cat.id" : req.params.id} , (err, key) => {
            if (err) {
                res.send(err);
            }
            res.json(key);
        });
    });
    //====================================================
    return api;
};
