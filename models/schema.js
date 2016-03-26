var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BearSchema   = new Schema({
    name: String,
    title: String,
    body: String,
    update: Boolean,
    number: Number
});

var SessionApi = new Schema({
    name: String,
    title: String,
    updated_at: { type: Date, default: Date.now },
    user: {
        type: Schema.ObjectId,
        ref: 'users'
    }
});

var Bear = mongoose.model('Bear', BearSchema);
var Session = mongoose.model('Session', SessionApi);