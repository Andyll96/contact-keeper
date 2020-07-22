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
        let user = await User.findOne({email: email});

        if(user){
            return res.status(400).json({msg: 'User already exists'});
        }

        user = new User({
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // res.send('User saved');
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {
            // 3600 secs = 1 hour
            expiresIn: 3600
        }, (err, token) => {
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