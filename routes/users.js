const mongoose = require('mongoose');
const _ = require('lodash');
const express = require('express');
const apiDebugger = require('debug')('app:api');
const { validateUser, User } = require('../models/user_schema');
const router = express.Router();
const CustomErr = require('../common/error');
const auth = require('../middlewares/authenticator')
const admin = require('../middlewares/admin-checker')

router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).where({
            isDeleted: false
        });
        if (user) {
            res.send(user);
        } else {
            res.status(CustomErr.statusCodeNotFound).send(new CustomErr(CustomErr.statusCodeNotFound, "User not found"));
        }
    } catch (err) {
        res.status(CustomErr.statusCodeNotFound).send(new CustomErr(CustomErr.statusCodeNotFound, err.message));
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).where({
            isDeleted: false
        });
        if (user) {
            res.send(user);
        } else {
            res.status(CustomErr.statusCodeNotFound).send(new CustomErr(CustomErr.statusCodeNotFound, "User not found"));
        }
    } catch (err) {
        res.status(CustomErr.statusCodeNotFound).send(new CustomErr(CustomErr.statusCodeNotFound, err.message));
    }
});

router.post('/', async (req, res) => {
    const userRequest = req.body;
    const error = validateUser(req.body, false);
    if (error) {
        return res.status(CustomErr.statusCodeBadRequest).send(new CustomErr(CustomErr.statusCodeBadRequest, error.message));
    }
    try {
        let result = await User.findOne().or([{ socialId: userRequest.socialId }, { email: userRequest.email }]);
        if (!result) {
            user = new User(_.pick(userRequest, ['name', 'email', 'isEmailVerified', 'profileImage', 'socialId', 'socialMethod', 'countryCode']));
            user.isEmailVerified = true;
            if (userRequest.mobile) {
                user.mobile = userRequest.mobile;
                user.isMobileVerified = false;
                const ifExist = await User.findOne({ 'mobile': user.mobile });
                if (ifExist) {
                    return res.status(CustomErr.statusCodeBadRequest).send(new CustomErr(CustomErr.statusCodeBadRequest, "Invalid mobile number"));
                }
            }
            result = await user.save();
        }
        const token = result.generateAuthToken();
        res.header('Authorization', token).send(result);
    } catch (err) {
        res.status(CustomErr.errorOccurred).send(new CustomErr(CustomErr.errorOccurred, err.message));
    }
});



router.put('/update', auth, async (req, res) => {
    const userRequest = req.body;
    const error = validateUser(req.body, true);
    if (error) {
        return res.status(CustomErr.statusCodeBadRequest).send(new CustomErr(CustomErr.statusCodeBadRequest, error.message));
    }
    try {
        const existingUser = await User.findById(req.user._id).where({
            isDeleted: false
        });
        if (!existingUser) {
            return res.status(CustomErr.statusCodeNotFound).send(new CustomErr(CustomErr.statusCodeNotFound, "User not found"));
        }
        if (userRequest.mobile) {
            const checkForMobile = await User.findOne({ mobile: userRequest.mobile });
            if (!checkForMobile) {
                if (existingUser.mobile) {
                    if (existingUser.mobile != userRequest.mobile) {
                        existingUser.isMobileVerified = false;
                    }
                    existingUser.mobile = userRequest.mobile;
                } else {
                    existingUser.mobile = userRequest.mobile;
                    existingUser.isMobileVerified = false;
                }
            } else {
                return res.status(CustomErr.statusCodeBadRequest).send(new CustomErr(CustomErr.statusCodeBadRequest, "Invalid mobile number"));
            }
        }
        let params = {
            name: userRequest.name,
            profileImage: userRequest.profileImage,
            socialId: userRequest.socialId,
            socialMethod: userRequest.socialMethod,
            countryCode: userRequest.countryCode,
            isDeleted: userRequest.isDeleted
        };
        for (let prop in params) if (userRequest[prop]) existingUser[prop] = userRequest[prop];
        apiDebugger(existingUser);
        const result = await existingUser.save()
        res.send(result)
    } catch (err) {
        res.status(CustomErr.statusCodeBadRequest).send(new CustomErr(CustomErr.statusCodeBadRequest, err.message));
    }
});



router.delete('/:id', [auth, admin], async (req, res) => {
    const userRequest = req.body;
    const error = validateUser(req.body, true);
    if (error) {
        return res.status(CustomErr.statusCodeBadRequest).send(new CustomErr(CustomErr.statusCodeBadRequest, error.message));
    }
    try {
        const result = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                isDeleted: true
            }
        });
        res.send(result);
    } catch (err) {
        res.status(CustomErr.statusCodeBadRequest).send(new CustomErr(CustomErr.statusCodeBadRequest, err.message));
    }
});


exports.routes = router;