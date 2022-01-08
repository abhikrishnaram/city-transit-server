const express = require('express')
const Article = require('./../models/article.js')
const QuizSchema = require('./../models/quiz.js')
const CreatorQuizSchema = require('./../models/creatorquiz.js')
const ResultSchema = require('./../models/result.js')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')

router.get('/blog', async (req, res) => {
    const articles = await Article.find({},{ markdown: 0 }).sort({date: 'desc'});    
    res.status(200).json(articles)
});

router.get('/blog/cover', async (req, res) => {
    const articles = await Article.find({},{ markdown: 0 }).sort({date: 'desc'}).limit(3);    
    res.status(200).json(articles)
});

router.get('/blog/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        res.status(200).json(article)
    } catch (e) {
        res.json('error = '+e);
    }
});



router.get('/quiz', async (req, res) => {
    const quizzez = await QuizSchema.find({},{ questions: 0, answers: 0, options: 0 }).sort({date: 'desc'});    
    res.status(200).json(quizzez)
});

router.get('/quiz/cover', async (req, res) => {
    const quizzez = await QuizSchema.find({},{ questions: 0, answers: 0, options: 0 }).sort({date: 'desc'}).limit(3);    
    res.status(200).json(quizzez)
});

router.get('/quiz/random', async (req, res) => {

    QuizSchema.countDocuments().exec(function(err, count){

    var random = Math.floor(Math.random() * count);

    QuizSchema.findOne({},{ questions: 0, answers: 0, options: 0 }).skip(random).exec(
        function (err, result) {
            res.status(200).json(result) 
        });

    });
   // const quizzez = await QuizSchema.find({},{ questions: 0, answers: 0, options: 0 }).sort({date: 'desc'}).limit(3);    
    //res.status(200).json(quizzez)
});

router.get('/quiz/:id', async (req, res) => {
    try {
        const quiz = await QuizSchema.findById(req.params.id);
        res.status(200).json(quiz)
    } catch (e) {
        res.json("Error "+e);
    }    
});

router.get('/quiz/min/:id', async (req, res) => {
    try {
        const quiz = await QuizSchema.findById(req.params.id,{questions: 0, options: 0, author: 0});
        res.status(200).json(quiz)
    } catch (e) {
        res.json("Error "+e);
    }    
});

router.get('/quiz/p/:id', async (req, res) => {
    try {
        const quiz = await CreatorQuizSchema.find({"url": req.params.id},{ key: 0, answers: 0});
        res.status(200).json(quiz[0])
    } catch (e) {
        res.json("Error "+e);
    }    
});

router.post('/creatorquiz', async (req, res, next) => {
    req.quiz = new CreatorQuizSchema();
    console.log(req.body)
    next()
}, creator_quiz_upload('new'));

function creator_quiz_upload(path) {
    return async (req, res) => {
        quiz = req.quiz;
        quiz.key = req.body.key,
        quiz.url = req.body.url,
        quiz.questions = req.body.questions,
        quiz.answers = req.body.answers,
        quiz.options = req.body.options,
        quiz.username = req.body.username,
        quiz.location = req.body.location,
        quiz.date = new Date().toLocaleDateString(),
        quiz.org_id = req.body.org_id
        

        try {
            quiz = await quiz.save();
            res.status(200).json({"status":"success"});
        } catch (e) {
            console.log(e);
            res.status(404).json({ "error": e })
        }
    }
}

router.get('/quiz/creatorquiz/score/:id', async (req, res) => {
    try {
        const quizRes = await ResultSchema.find({"url":req.params.id},{}).sort({date: 'desc'});
        res.status(200).json(quizRes)
    } catch (e) {
        res.json("Error "+e);
    }    
});

router.get('/quiz/p/score/:id', async (req, res) => {
    try {
        const quiz = await ResultSchema.find({"_id": req.params.id});
        res.status(200).json(quiz[0])
    } catch (e) {
        res.json("Error "+e);
    }    
});

router.post('/needcarpooling', async (req, res, next) => {
    req.result = new ResultSchema();
    //console.log(req.body)
    if (req.body.q_type!=="usrop") {
        const realans = await CreatorQuizSchema.find({"url": req.body.url},{ key: 0, options: 0, questions: 0 })
        console.log(realans[0] + " isahdk;");
        var score = 0;
        for(var i = 0; i< realans[0].answers.length;i++){
            console.log(realans[0].answers[i]+"       "+req.body.answers[i])
            if(realans[0].answers[i] == req.body.answers[i])
                score++;
        }
        req.score = score;        
        console.log(score)
    }
    next()
}, upload_score());

function upload_score() {
    return async (req, res) => {
        result = req.result;
        result.url = req.body.url,
        result.questions = req.body.questions,
        result.answers = req.body.answers,
        result.playername = req.body.username,
        result.location = req.body.location,
        result.q_type = req.body.q_type,
        result.org_id = req.body.org_id,
        result.date = new Date().toLocaleDateString()
        
        if (req.body.q_type!=="usrop") 
            result.score = req.score
        else
            result.score = 0
        

        try {
            result = await result.save();
            res.status(200).json({"status":"success","result":result});
        } catch (e) {
            console.log(e);
            res.status(404).json({ "error": e })
        }
    }
}

module.exports = router