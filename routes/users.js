const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

// @route   POST api/users
// @desc    Register a user
// @access  Public
// the '/' refers to /api/users, as defined in server.js
router.post('/', [
    check('name', 'Please add name').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})
], async (req, res) => {
    // in order to use req.body we need to add middleware to server.js
    // res.send(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    } 
    
    const {name, email, password} = req.body;

    try {
        // will search the database for another user with the same email address
        let user = await User.findOne({email: email});

        // if it finds a existing user with the same email address
        if(user){
            return res.status(400).json({msg: 'User already exists'});
        }

        // otherwise create a new user
        user = new User({
            name,
            email,
            password
        });

        // refer to old notes on security
        const salt = await bcrypt.genSalt(10);
        // hash the password with the salt
        user.password = await bcrypt.hash(password, salt);
        // Save comes from Mongoose
        await user.save();

        // res.send('User saved');
        // the object that is sent back to the client with the token
        const payload = {
            user: {
                // this id is added in by mongodb
                id: user.id
            }
        }

        // console.log(payload);

        // to generate a token we have to sign it
        // the secret shouldn't be put directly in the file, keep it in default.json
        jwt.sign(payload, config.get('jwtSecret'), {
            // this object is your options
            // 3600 secs = 1 hour
            expiresIn: 3600
        }, (err, token) => {
            // token is given by the sign function
            if (err) throw err;
            res.json({token});
            
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// we have to export the router or it won't work
module.exports = router;