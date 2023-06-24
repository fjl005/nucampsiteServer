const mongoose = require('mongoose');
// import plug
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // Now, we can remove the username and password because the passportLocalMongoose plugin will handle adding these fields to the document along with hashing and salting the password
    // username: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // password: {
    //     type: String,
    //     required: true
    // },
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    },
    facebookId: String
});

// plug in used here
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);