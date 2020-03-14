var config = require('config.json');
var express = require('express');
var router = express.Router();
var questionService = require('services/question.service');

// routes
router.post('/register', registerQuestion);
// router.get('/:_id', getCurrentQuestion);
// router.put('/:_id', updateQuestion);
router.delete('/:_id', deleteQuestion);
router.get('/', get_all_Questions);

module.exports = router;

function registerQuestion(req, res) {
    questionService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function get_all_Questions(req, res) {
    questionService.get_all_questions()
        .then(function (lista_questions) {
            res.send(lista_questions);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteQuestion(req, res) {
    questionService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}