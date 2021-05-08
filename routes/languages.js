const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const apiDebugger = require('debug')('app:api');
const { langValidator, Language } = require('../models/language_schema');
const router = express.Router();
const CustomErr = require('../common/error');
const asyncExecutor = require('../middlewares/async');

router.get("/", asyncExecutor(async (req, res) => {
    let languages = await Language.find();
    res.send(languages);
}))

router.post("/", asyncExecutor(async (req, res) => {
    let error = langValidator(req.body);
    if (error) {
        console.log(error);
        res.status(CustomErr.statusCodeBadRequest).send(new CustomErr(CustomErr.statusCodeBadRequest, error.message));
    }
    const lang = new Language(_.pick(req.body, ['name', 'isoCode']));
    const result = await lang.save();
    res.send(result);

}));


exports.routes = router;