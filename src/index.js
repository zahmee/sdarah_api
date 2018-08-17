import http from 'http' ;
import express from 'express' ;
import bodyParser from 'body-parser' ;
import mongoose from 'mongoose' ;
import passport from "passport";
const LocalStrategy = require("passport-local").Strategy ;
import config from './config' ;
import routes from './routes' ;
import cors from 'cors';
// --- commit



let app = express() ;
app.server = http.createServer(app) ;
mongoose.Promise = Promise;
//   middleware
//   parse application/json
app.use(cors()) ;
app.use(bodyParser.json({
    limit:config.bodyLimit 
})) ;

//   passport config <----------  important
app.use(passport.initialize()) ;
let Account = require("./model/account") ;
passport.use(new LocalStrategy({
    usernameField:"username" ,
    passwordField :"password"
},
    Account.authenticate() 
)) ;
passport.serializeUser(Account.serializeUser()) ;
passport.deserializeUser(Account.deserializeUser()) ;

//   api rounes v1
app.use('/v1' , routes ) ;
app.server.listen(config.port) ;
console.log(`Start on port ${ app.server.address().port}`) ;

export default app ;