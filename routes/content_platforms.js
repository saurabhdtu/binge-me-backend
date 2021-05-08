const express = require('express');
const _ = require('lodash');
const apiDebugger = require('debug')('app:api');
const { validateContentPlatform, ContentPlatform } = require('../models/content_platform_schema');
const router = express.Router();
const CustomErr = require('../common/error');
const asyncExecutor = require('../middlewares/async');

router.get("/", asyncExecutor(async (req, res, next) => {
    let platforms = await ContentPlatform.find();
    res.send(platforms);
}));


router.post("/", asyncExecutor(async (req, res, next) => {
    if (Array.isArray(req.body)) {
        let arr = []
        let error;
        req.body.forEach(contentPlatfom => {
            error = validateContentPlatform(contentPlatfom);
            if (error) {
                return;
            } else {
                apiDebugger(contentPlatfom.subscriptionPlans);
                const cp = new ContentPlatform(_.pick(contentPlatfom, ['name', 'subscriptionPlans']));
                arr.push(cp);
            }
        })
        apiDebugger(arr);
        if (error) {
            return res.status(CustomErr.statusCodeBadRequest).send(new CustomErr(CustomErr.statusCodeBadRequest, error.message));
        } else {
            var result = await ContentPlatform.insertMany(arr);
            return res.send(result);
        }
    } else {
        let error = validateContentPlatform(req.body);
        if (error) {
            res.status(CustomErr.statusCodeBadRequest).send(new CustomErr(CustomErr.statusCodeBadRequest, error.message));
        }
        const contentPlatfom = new ContentPlatform(_.pick(req.body, ['name', 'subscriptionPlans']))

        const result = await contentPlatfom.save();
        res.send(result);
    }
}));


exports.routes = router;