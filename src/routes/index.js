import express from 'express' ;
import config from '../config' ;
import middleware from '../middleware' ;
import initializeDb from '../db' ;
import key from "../controller/key"; 
import keys from "../controller/keys"; 
import account from "../controller/account"; 
import users from "../controller/users"; 
import settings from "../controller/settings"; 
import items from "../controller/items"; 
import people from "../controller/people"; 
import csBills from "../controller/csBills"; 
import itemsDetails from "../controller/itemsDetails"; 
import invoice from "../controller/invoice"; 
import branches from "../controller/branches"; 
import exchangeCustody from "../controller/exchangeCustody"; 

let router = express() ;

initializeDb(db =>{
  //middleware
  router.use(middleware({ config, db }));
  //api routes v1 (/v1)
  router.use("/key", key({ config, db })); 
  router.use("/keys", keys({ config, db })); 
  router.use("/account", account({ config, db })); 
  router.use("/users", users({ config, db })); 
  router.use("/settings", settings({ config, db })); 
  router.use("/items", items({ config, db })); 
  router.use("/peoples", people({ config, db })); 
  router.use("/csbills", csBills({ config, db })); 
  router.use("/itemsDetails", itemsDetails({ config, db })); 
  router.use("/invoice", invoice({ config, db })); 
  router.use("/branches", branches({ config, db })); 
  router.use("/exchangeCustody", exchangeCustody({ config, db })); 

});
export default router ;