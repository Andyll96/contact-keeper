const express = require('express');
const router = express.Router();

// @route   POST api/users
// @desc    Register a user
// @access  Public
// the '/' refers to /api/users, as defined in server.js
router.post('/', (req, res) => {
    res.send('Register a user');
}); 

// we have to export the router or it won't work
module.exports = router;