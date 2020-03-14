var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('questions');

var service = {};

// service.authenticate = authenticate;
service.getById = getById;
service.create = create;
// service.update = update;
service.delete = _delete;
service.get_all_questions = get_all_questions;

module.exports = service; 

function create(questionParam) {
    var deferred = Q.defer();

    // validation
    db.questions.findOne(
        { question: questionParam.text },
        function (err, question) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (question) {
                // username already exists
                deferred.reject('Question: "' + questionParam.text + '" already exists');
            } else {
                createQuestion();
            }
        });

       
    function createQuestion() {
        // set user object to userParam without the cleartext password
        
        db.questions.insert(
            questionParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}


function get_all_questions() {
    var deferred = Q.defer();   
    
    db.questions.find({}).toArray(        
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve(doc);
        });
return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.questions.findById(_id, function (err, question) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (question) {
            // return user (without hashed password)
            deferred.resolve(_.omit(question, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.questions.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}