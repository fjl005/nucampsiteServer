const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

// We will create a commentSchema that will be nested inside the campsiteSchema.
const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Schema takes two arguments: the first is required and is an object that contains the definition for the schema via the object's properties. The second argument is optional and is used for setting various configuration options.
const campsiteSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    elevation: {
        type: Number,
        required: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

// Next, let's create a model named Campsite for the campsites collection. Mongoose will automatically look for the lowercase plural version of whatever we put in the field.
// You can think of thise model as a desugared class. This model will be used to instantiate documents for mongoDB.
const Campsite = mongoose.model('Campsite', campsiteSchema);

module.exports = Campsite;