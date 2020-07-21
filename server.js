/*
npm i express bcryptjs jsonwebtoken config express-validator mongoose

express - web framework to handle routing
bcryptjs - handles hashing passwords, b/c we have authentication in our app
jsonwebtoken - for authentication, we can create JSON Web Token (JWT) which is used to access protected routes on the backend
config - for global variables
express-validator - validate any body of data coming in
mongoose - an abstraction layer, so we can deal with out database. Also allowing us to create models

Development dependencies
npm i -D nodemon concurrently

nodemon - allow us to keep watching our server
concurrently - allow us to run our backend and frontend at the same time
*/
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({extended: false}));

// adding a route / endpoint
// we use res.json b/c we're making a json api
app.get('/', (req, res) => res.json({msg: 'Welcome to the Contact Keeper API...'}));

// Define Routes
// eg. anything that uses /api/users will be routed to users.js
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

// this will look for an environment variable first which will be used in production
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));