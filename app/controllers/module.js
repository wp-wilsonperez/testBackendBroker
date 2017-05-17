
import moment from 'moment';
import acl from "../configs/acl";

import Module from "../models/module";

let moduleController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "module";
      return next();
   }

   function findAction (callback){
      Module.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/modules', [control.auth, controller, control.acl], (req, res) => {

      Module.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", modules: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/modules/:id', [control.auth, controller, control.acl], (req, res) => {

      Module.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", role: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/module', [control.auth, controller, control.acl], (req, res) => {

      let module = new Module({
         name: req.body.name,
         description: req.body.description,
         dateCreate: moment(),
         userCreate: req.user._id,
         dateUpdate: moment(),
         userUpdate: req.user._id
      });

      module.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/module/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         description: req.body.description,
         dateUpdate: moment(),
         userUpdate: req.user._id
      };

      Module.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/module/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Module.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

}

export default moduleController
