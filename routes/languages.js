const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const apiDebugger = require('debug')('app:api');
const { langValidator, Language } = require('../models/language_schema');
const router = express.Router();
const CustomErr = require('../common/error');

router.get("/", async (req, res) => {
    try {
        let languages = await Language.find();
        res.send(languages);
    } catch (err) {
        res.status(CustomErr.errorOccurred).send(new CustomErr(CustomErr.errorOccurred, err));
    }
})

router.post("/", async (req, res) => {
    let error = langValidator(req.body);
    if (error) {
        console.log(error);
        res.status(CustomErr.statusCodeBadRequest).send(new CustomErr(CustomErr.statusCodeBadRequest, error.message));
    }

    const lang = new Language(_.pick(req.body, ['name', 'isoCode']));
    try {
        const result = await lang.save();
        res.send(result);
    } catch (err) {
        res.status(CustomErr.errorOccurred).send(new CustomErr(CustomErr.errorOccurred, err.message));
    }
})


exports.routes = router;