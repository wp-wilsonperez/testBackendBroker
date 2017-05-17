
import sha1 from 'sha1';
import moment from 'moment';
import multer from 'multer';
import nodemailer from 'nodemailer';
import fs from 'fs';
import acl from "../configs/acl";
import configmailer from "../configs/nodemailer";

import Business from "../models/business";

const pathRender = `uploads/business`;
const pathBusiness = `./public/${pathRender}`;
const smtpTransport =  nodemailer.createTransport(`smtps://${configmailer.mail}%40gmail.com:${configmailer.password}@smtp.gmail.com`);

if (!fs.existsSync(pathBusiness)){
    fs.mkdirSync(pathBusiness);
}

let storage = multer.diskStorage({
   destination: function(req, file, callback) {
      callback(null, pathBusiness);
   },
   filename: function(req, file, callback){
      var basename = file.originalname.split(/[\\/]/).pop(),
      pos = basename.lastIndexOf(".");
      if (basename === "" || pos < 1)
         return "";
      callback(null, file.fieldname + '-' + Date.now() + '.' + basename.slice(pos + 1));
   }
});

let upload = multer({storage: storage}).single("businessImg");

let businessController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "business";
      return next();
   }

   function findAction (callback){
      Business.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/business/list', [control.auth, controller, control.acl], (req, res) => {

      Business.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", businesses: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/business/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Business.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", business: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/business/add', [control.auth, controller, control.acl], (req, res) => {

      let business = new Business({
         ruc: req.body.ruc,
         name: req.body.name,
         userMaster: req.body.userMaster,
         password: sha1(req.body.password),
         phone: req.body.phone,
         movil: req.body.movil,
         address: req.body.address,
         businessImg: req.body.businessImg,
         description: req.body.description,
         constitutionDate: req.body.constitutionDate,
         parking: req.body.parking,
         numberEmp: req.body.numberEmp,
         mail: req.body.mail,
         web: req.body.web,
         Enabled: req.body.Enabled,
         Actived: req.body.Actived,
         idLicense: req.body.idLicense,
         nameBBDD: "name BBDD",
         dateCreate: moment(),
         userCreate: req.user._id,
         dateUpdate: moment(),
         userUpdate: req.user._id
      });

      business.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               let html = "";
               html += "<br>Test : send</br>";
            let mailOptions = {
               from: `TEST<${configmailer.mail}@gmail.com>`,
               to: doc.mail,
               subject: "subjet test",
               html: html
            };

            smtpTransport.sendMail(mailOptions, function(error, response){
               if(error){
                  console.log("No Send");
                  console.log(error);
               }else{
                  console.log("Send");
               }
            });
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/business/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         ruc: req.body.ruc,
         name: req.body.name,
         userMaster: req.body.userMaster,
         password: sha1(req.body.password),
         phone: req.body.phone,
         movil: req.body.movil,
         address: req.body.address,
         businessImg: req.body.businessImg,
         description: req.body.description,
         constitutionDate: req.body.constitutionDate,
         parking: req.body.parking,
         numberEmp: req.body.numberEmp,
         mail: req.body.mail,
         web: req.body.web,
         Enabled: req.body.Enabled,
         Actived: req.body.Actived,
         dateUpdate: moment(),
         userUpdate: req.user._id
      };

      Business.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/business/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Business.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/business/addbusinessImg', [control.auth, controller, control.acl], (req, res) => {

      upload(req , res , function(err) {
         if(!err){
            let $businessImg = `${req.file.filename}`;
            res.send({msg: "OK", businessImg: $businessImg, path: pathRender});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/business/deletebusinessImg/:name', [control.auth, controller, control.acl], (req, res) => {

      let $businessImgPath = `${pathBusiness}/${req.params.name}`;
      fs.unlink($businessImgPath, function (err) {
         if(!err){
            res.send({msg: "OK"});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.get('/business/viewSchedule/:id', [control.auth, controller, control.acl], (req, res) => {

      Business.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", schedule: doc.schedule});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/business/addSchedule/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let $schedule = req.body.schedule;
      console.log($schedule);
      let update = {
         schedule: $schedule
      };

      Business.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

}

export default businessController
