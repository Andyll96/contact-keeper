// This is a C(reate).R(ead).U(pdate).D(elete) route 

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Contact = require('../models/Contact');

// @route   GET api/contacts
// @desc    Get all users contacts
// @access  Private
// the '/' refers to /api/contacts, as defined in server.js
router.get('/', auth, async (req, res) => {
    // res.send('Get all contacts');
    try {
        // -1 date, the most recent
        const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 });
        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/contacts
// @desc    Add new contact
// @access  Private
// the '/' refers to /api/contacts, as defined in server.js
router.post('/', [auth, [
    check('name', 'Name is required').not().isEmpty()
]], async (req, res) => {
    // res.send('Add contact');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            type,
            user: req.user.id
        });

        cosnt contact = await newContact.save();

        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/contacts/:id
// @desc    Update contact
// @access  Private
// the '/' refers to /api/contacts, as defined in server.js
// we use :id b/c we have to describe what contact we want to update or delete
router.put('/:id', auth, async (req, res) => {
    // res.send('Update contact');
    const { name, email, phone, type } = req.body;

    // Build Contact Object
    const contactFields = {};
    if (name) contactFields.name = name;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;
    if (type) contactFields.type = type;

    try {
        let contact = await Contact.findById(req.params.id);

        if(!contact) return res.status(404).json({msg: 'Contact not found'});

        // Make sure user owns contact
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'Not Authorized'});
        }

        contact = await Contact.findByIdAndUpdate(req.params.id, {$set: contactFields}, {new: true});

        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/contacts/:id
// @desc    Delete contact
// @access  Private
// the '/' refers to /api/contacts, as defined in server.js
// we use :id b/c we have to describe what contact we want to update or delete
router.delete('/:id', auth, async (req, res) => {
    // res.send('Delete contact');
    try {
        let contact = await Contact.findById(req.params.id);

        if(!contact) return res.status(404).json({msg: 'Contact not found'});

        // Make sure user owns contact
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'Not Authorized'});
        }

        // DONT USE DELETE, THAT'S DEPRECATED
        await Contact.findByIdAndRemove(req.params.id);

        res.json({msg: 'Contact removed'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// we have to export the router or it won't work
module.exports = router;