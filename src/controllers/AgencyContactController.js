/**
 * Created by yuanyuan 4/2/2016
 */

var router = require('express').Router();
var Session = require('../models/Session');
var User = require('../models/User');
router.AgencyContactRequest = require('../models/AgencyContactRequest');
router.AgencyContact = require('../models/AgencyContact');

/**
 * Retrieve the agency contact requirement between two users
 */
//router.get('/request/:user1', Session.loginRequired);
router.get('/request/:user1', function(req, res){
    router.AgencyContactRequest.findAll({
        where: {
            target: req.params.user1
        }
    }).then(function(agencyContactRequest){
        return res.status(200).json(agencyContactRequest);
    });
});

router.get('/content/:user1', function(req, res){
    router.AgencyContact.findAll({
        where: {
            author: req.params.user1
        }
    }).then(function(agencyContact){
        return res.status(200).json(agencyContact);
    });
});

/**
 * Post an agency contact requirement and save it in database
 */
 //router.post('/request/:user1/:user2', Session.loginRequired);
 router.post('/request/:user1/:user2', function(req, res){
     //validate the request body
    //  if( typeof req.body.content === 'undefined'){
    //      res.status(422).end();
    //      return;
    //  }

     //validate the current login user is the sender or not
     if(req.params.user1 != req.session.user.name){
         res.status(401).end();
         return;
     }

     User.findOne({
         where: {
             username: req.params.user2
         }
     }).then(function(user){
         if(!user){
             res.status(404).end();
         }else{
             router.AgencyContactRequest.create({
                 content: req.body.content,
                 author: req.params.user1,
                 target: req.params.user2
             }).then(function(agencyContactRequest){
                 res.status(201).json(agencyContactRequest);
             });
         }
     });
 });


/**
 * User2 validates user1's agency contact request
 */
 //router.post('/reply/:user2/:user1',Session.loginRequired);
 router.post('/reply/:user2/:user1', function(req, res) {
     //validate the request body
    //  if( typeof req.body.content === 'undefined'){
    //      res.status(422).end();
    //      return;
    //  }

     //validate the current login user is the sender or not
     if(req.params.user2 != req.session.user.name){
         res.status(401).end();
         return;
     }

     User.findOne({
         where: {
             username: req.params.user1
         }
     }).then(function(user) {
         if(!user){
             res.status(404).end();
         }else{
             if ( req.body.state === true){
                 router.AgencyContact.create({
                     author: req.params.user1,
                     target: req.params.user2
                 }).then(function() {
                     router.AgencyContactRequest.findOne({
                         where: {
                             author: req.params.user1,
                             target: req.params.user2
                         }
                     }).then(function(request){
                         router.AgencyContactRequest.delete(request.id);
                     }).then(function() {
                         res.status(204).end();
                     });

                 });
             } else {
                router.AgencyContactRequest.findOne({
                    where: {
                        author: req.params.user1,
                        target: req.params.user2
                    }
                }).then(function(request) {
                    router.AgencyContactRequest.delete(request.id);
                }).then(function() {
                    res.status(201).end();
                });
             }
         }
     });

 });


module.exports = router;
