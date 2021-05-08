const express = require('express');
const apiDebugger = require('debug')('app:api');
const { genreValidator, Genre } = require('../models/genre_schema');
const router = express.Router();
const CustomErr = require('../common/error');
const asyncExecutor = require('../middlewares/async');

router.get("/", asyncExecutor(async (req, res, next) => {
    let genres = await Genre.find();
    res.send(genres);
}));


router.post("/", asyncExecutor(async (req, res, next) => {
    if (Array.isArray(req.body)) {
        let arr = []
        req.body.forEach(genre => {
            let error = genreValidator(genre);
            if (error) {
                res.status(CustomErr.statusCodeBadRequest).send(new CustomErr(CustomErr.statusCodeBadRequest, error.message));
                return
            } else {
                const newG = new Genre({
                    name: genre.name
                });
                arr.push(newG);
            }
        })
        var result = await Genre.insertMany(arr);
        res.send(result);
    } else {
        let error = genreValidator(req.body);
        if (error) {
            res.status(CustomErr.statusCodeBadRequest).send(new CustomErr(CustomErr.statusCodeBadRequest, error.message));
        }
        const genre = new Genre({
            name: req.body.name
        })

        const result = await genre.save();
        res.send(result);
    }
}));


exports.routes = router;