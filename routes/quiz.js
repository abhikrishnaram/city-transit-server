const express = require('express')
const QuizSchema = require('../models/carbon.js')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')

router.get('/', async (req, res) => {
    const quiz = await QuizSchema.find().sort({ date: 'desc' });
    res.render('quiz', { quizzes: quiz })
});


router.get('/new', (req, res) => {
    res.render('_quiz/new')
});

router.get('/new/oponly', (req, res) => {
    res.render('_quiz/new_step2', { quiz: new QuizSchema(), form_type: "oponly" })
});

router.get('/new/opimg', (req, res) => {
    res.render('_quiz/new_step2', { quiz: new QuizSchema(), form_type: "opimg" })
});

router.get('/new/usrop', (req, res) => {
    res.render('_quiz/new_step2', { quiz: new QuizSchema(), form_type: "usrop" })
});

router.get('/new/twoop', (req, res) => {
    res.render('_quiz/new_step2', { quiz: new QuizSchema(), form_type: "twoop" })
});

router.get('/new/twoopimg', (req, res) => {
    res.render('_quiz/new_step2', { quiz: new QuizSchema(), form_type: "twoopimg" })
});

router.get('/:id', async (req, res) => {
    try {
        const quiz = await QuizSchema.findById(req.params.id);
        console.log(quiz);
        res.render('_quiz/show', { quiz: quiz });
    } catch (e) {
        res.redirect('/quiz');
    }
});

router.get('/edit/:id', async (req, res) => {
    try {
        const quiz = await QuizSchema.findById(req.params.id);
        res.render('_quiz/edit', { quiz: quiz, form_type: quiz.q_type });
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});


router.delete('/:id', async (req, res) => {
    const quiz = await QuizSchema.findByIdAndDelete(req.params.id);
    res.redirect('/quiz')
})

router.post('/edit/:id', async (req, res, next) => {
    req.quiz = await QuizSchema.findById(req.params.id)
    console.log(req.quiz);
    next()
}, edit_quiz());

function edit_quiz() {
    return async (req, res) => {
        console.log(req.params)
        console.log(req.body)
        console.log("body above")
        console.log("\n")
        console.log("quiz below")
        quiz = req.quiz;
        quiz.name = req.body.name,
        quiz.description = req.body.description,
        quiz.cover_img_url = req.body.cover_img_url,
        quiz.author = req.body.author,
        quiz.date = new Date().toLocaleDateString(),
        quiz.editable = req.body.editable?true:false
        quiz.questions = [];
        quiz.options = [];
        if (quiz.q_type === "oponly") {
            req.body.quest.map(data => {
                quiz.questions.push(data);
            })
            for (var i = 1; i <= req.body.quest.length; i++) {
                quiz.options.push(req.body['op' + i]);
            }
        } else if (quiz.q_type === "twoop") {
            req.body.quest.map(data => {
                quiz.questions.push(data);
            })
            for(var i = 1; i<=req.body.quest.length; i++ ){
                quiz.options.push(req.body['op' + i]);             
            }
        } else if (quiz.q_type === "opimg") {
            req.body.quest.map(data => {
                quiz.questions.push(data);
            })
            for (var i = 1; i <= req.body.quest.length; i++) {
                quiz.options.push([{ "opvalue": req.body['op' + i + '1'], "opurl": req.body['op' + i + '1url'] }, { "opvalue": req.body['op' + i + '2'], "opurl": req.body['op' + i + '2url'] }, { "opvalue": req.body['op' + i + '3'], "opurl": req.body['op' + i + '3url'] }, { "opvalue": req.body['op' + i + '4'], "opurl": req.body['op' + i + '4url'] }]);
            }
        } else if (quiz.q_type === "twoopimg") {
            req.body.quest.map(data => {
                quiz.questions.push(data);
            }) 
            for (var i = 1; i <= req.body.quest.length; i++) {
                quiz.options.push([{ "opvalue": req.body['op' + i + '1'], "opurl": req.body['op' + i + '1url'] }, { "opvalue": req.body['op' + i + '2'], "opurl": req.body['op' + i + '2url'] }]);
            }
        } else {
            req.body.quest.map(data => {
                quiz.questions.push(data);
            })
        }


        try {
            console.log(quiz)
            var quizres = await QuizSchema.replaceOne({_id: quiz},quiz);
            console.log(quizres + "res be like")
            res.redirect(`/quiz`);
        } catch (e) {
            console.log(e);
            res.render('_quiz/edit', { quiz: quiz, form_type: quiz.q_type })
        }
    }
}

router.post('/', async (req, res, next) => {
    req.quiz = new QuizSchema();
    next()
}, upload_article('new'));

function upload_article(path) {
    return async (req, res) => {
        console.log(req.body)
        console.log("\n")
        quiz = req.quiz;
        quiz.name = req.body.name,
            quiz.description = req.body.description,
            quiz.cover_img_url = req.body.cover_img_url,
            quiz.author = req.body.author,
            quiz.date = new Date().toLocaleDateString(),
            quiz.a_id = uuidv4()
            quiz.editable = req.body.editable?true:false
        quiz.q_type = req.body.q_type
        if (quiz.q_type === "oponly") {
            req.body.quest.map(data => {
                quiz.questions.push(data);
            })
            for (var i = 1; i <= req.body.quest.length; i++) {
                quiz.options.push(req.body['op' + i]);
            }
        } else if (quiz.q_type === "twoop") {
            req.body.quest.map(data => {
                quiz.questions.push(data);
            })
            for(var i = 1; i<=req.body.quest.length; i++ ){
                quiz.options.push(req.body['op' + i]);             
            }
        } else if (quiz.q_type === "opimg") {
            req.body.quest.map(data => {
                quiz.questions.push(data);
            })
            for (var i = 1; i <= req.body.quest.length; i++) {
                quiz.options.push([{ "opvalue": req.body['op' + i + '1'], "opurl": req.body['op' + i + '1url'] }, { "opvalue": req.body['op' + i + '2'], "opurl": req.body['op' + i + '2url'] }, { "opvalue": req.body['op' + i + '3'], "opurl": req.body['op' + i + '3url'] }, { "opvalue": req.body['op' + i + '4'], "opurl": req.body['op' + i + '4url'] }]);
            }
        } else if (quiz.q_type === "twoopimg") {
            req.body.quest.map(data => {
                quiz.questions.push(data);
            }) 
            for (var i = 1; i <= req.body.quest.length; i++) {
                quiz.options.push([{ "opvalue": req.body['op' + i + '1'], "opurl": req.body['op' + i + '1url'] }, { "opvalue": req.body['op' + i + '2'], "opurl": req.body['op' + i + '2url'] }]);
            }
        } else {
            req.body.quest.map(data => {
                quiz.questions.push(data);
            })
        }


        try {
            quiz = await quiz.save();
            console.log(quiz)
            res.redirect(`/quiz`);
        } catch (e) {
            console.log(e);
            res.render('_quiz/new_step2', { quiz: quiz, form_type: quiz.q_type })
        }
    }
}




module.exports = router