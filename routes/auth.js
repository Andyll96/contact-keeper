const express = require('express');
const router = express.Router();

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
// the '/' refers to /api/auth, as defined in server.js
router.get('/', (req, res) => {
    res.send('Get logged in user');
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