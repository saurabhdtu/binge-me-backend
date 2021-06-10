const { IdTokenClient } = require('google-auth-library');
const {User} = require('../../../models/user_schema');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
describe('user.generateAuthRoen()',()=>{
    it('should return valid JWT', ()=>{
        const id = new mongoose.Types.ObjectId().toHexString();
        const user = new User({_id:id, isAdmin:true});
        const decoded = jwt.verify( user.generateAuthToken(), config.get('jwtSecretKey'));
        expect(decoded).toMatchObject({_id:1, isAdmin:true});
    });
    
})