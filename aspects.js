/**
 * Created by chamod on 4/29/18.
 */
var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator/check')

router.get('/', function (req, res) {
    res.render('aspects');
});

router.post('/findAspects', [
    check('message')
        .isLength({min: 1})
        .withMessage('Review is required'),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.render('aspects', {
            data: req.body,
            errors: errors.mapped()
        })
    }

    //find aspects and sentiments
    aspects  = [
        {aspect : 'food', sentiment : -1},
        {aspect : 'drinks', sentiment : 0},
        {aspect : 'service', sentiment : 1},
    ]

    return res.render('aspects', {
        data: req.body,
        aspects: aspects,
    })
})

//export this router to use in our index.js
module.exports = router;