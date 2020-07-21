const mongoose = require('mongoose');
const config = require('config');

// gets this from default.json
const db = config.get('mongoURI');

// mongoose returns promises (async/await)
const connectDB = async () => {

    try {
        await mongoose.connect(db, {
            //  needed to avoid some warnings
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });

        console.log('MongoDB Connected...');
    } catch (err) {
        console.log("ERROR " + err.message);
        process.exit(1);
    }
}

module.exports = connectDB;