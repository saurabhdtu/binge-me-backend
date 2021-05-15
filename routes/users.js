const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const express = require('express');
const apiDebugger = require('debug')('app:api');
const { validateUser, User } = require('../models/user_schema');
const router = express.Router();
const config = require('config');
const CustomErr = require('../common/error');
const auth = require('../middlewares/async')
const admin = require('../middlewares/admin-checker')

router.get('/:id', auth, async (req, res) => {
    const user = await User.findById(req.params.id).where({
        isDeleted: false
    });
    if (user) {
        res.send(user);
    } else {
        res.status(CustomErr.statusCodeNotFound).send(new CustomErr(CustomErr.statusCodeNotFound, "User not found"));
    }
});

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).where({
        isDeleted: false
    });
    if (user) {
        res.send(user);
    } else {
        res.status(CustomErr.statusCodeNotFound).send(new CustomErr(CustomErr.statusCodeNotFound, "User not found"));
    }

});

router.post('/', async (req, res) => {
    const userRequest = req.body;
    const error = validateUser(req.body, false);
    if (error) {
        return res.status(CustomErr.statusCodeBadRequest).send(new CustomErr(CustomErr.statusCodeBadRequest, error.message));
    }
    const CLIENT_ID = config.get('client_id');
    const client = new OAuth2Client(CLIENT_ID);

    const ticket = await client.verifyIdToken({
        idToken: userRequest.socialToken,
        audience: CLIENT_ID,
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const authSocialId = payload['sub'];
    let isNew = false;
    let result = await User.findOne().or([{ socialId: userRequest.socialId }, { email: userRequest.email }]);
    if (userRequest.socialId != authSocialId)
        return res.status(CustomErr.statusCodeBadRequest).send(new CustomErr(CustomErr.statusCodeBadRequest, "Invalid social id"));
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
        isNew = true;
    }
    const token = result.generateAuthToken();
    result = result.toJSON()
    result = { ...result, isNew: isNew };
    console.log(result);
    res.header('Authorization', token).send(result);
});



router.put('/update', auth, async (req, res) => {
    const userRequest = req.body;
    const error = validateUser(req.body, true);
    if (error) {
        return res.status(CustomErr.statusCodeBadRequest).send(new CustomErr(CustomErr.statusCodeBadRequest, error.message));
    }
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
    res.send(result);
});



router.delete('/:id', [auth, admin], async (req, res) => {
    const userRequest = req.body;
    const error = validateUser(req.body, true);
    if (error) {
        return res.status(CustomErr.statusCodeBadRequest).send(new CustomErr(CustomErr.statusCodeBadRequest, error.message));
    }
    const result = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            isDeleted: true
        }
    });
    res.send(result);
});


exports.routes = router;