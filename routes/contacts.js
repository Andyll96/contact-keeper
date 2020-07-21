// This is a C(reate).R(ead).U(pdate).D(elete) route 

const express = require('express');
const router = express.Router();

// @route   GET api/contacts
// @desc    Get all users contacts
// @access  Private
// the '/' refers to /api/contacts, as defined in server.js
router.get('/', (req, res) => {
    res.send('Get all contacts');
}); 

// @route   POST api/contacts
// @desc    Add new contact
// @access  Private
// the '/' refers to /api/contacts, as defined in server.js
router.post('/', (req, res) => {
    res.send('Add contact');
}); 

// @route   PUT api/contacts/:id
// @desc    Update contact
// @access  Private
// the '/' refers to /api/contacts, as defined in server.js
// we use :id b/c we have to describe what contact we want to update or delete
router.put('/:id', (req, res) => {
    res.send('Update contact');
}); 

// @route   DELETE api/contacts/:id
// @desc    Delete contact
// @access  Private
// the '/' refers to /api/contacts, as defined in server.js
// we use :id b/c we have to describe what contact we want to update or delete
router.delete('/:id', (req, res) => {
    res.send('Delete contact');
}); 

// we have to export the router or it won't work
module.exports = router;