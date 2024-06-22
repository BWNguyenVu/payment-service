const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
require('dotenv').config();

const MONGO_DB_CLOUD = process.env.MONGO_DB;
const MONGO_DB_LOCAL = process.env.CONNECTION_STRING
function connectDB() {
    mongoose.connect(MONGO_DB_LOCAL, {

    })
        .then(() => {
            console.log('MongoDB Connected');
        })
        .catch(() => {
            console.log('MongoDB connection failed');
        });
}

module.exports = { connectDB };
