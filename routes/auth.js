const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
// the '/' refers to /api/auth, as defined in server.js
router.get('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is requried').exists()
], async (req, res) => {
    // res.send('Get logged in user');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

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
            res.json({ token });

        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth
// @desc    Auth user and get token
// @access  Public
// the '/' refers to /api/auth, as defined in server.js
router.post('/', (req, res) => {
    res.send('Log in user');
});

// we have to export the router or it won't work
module.exports = router;