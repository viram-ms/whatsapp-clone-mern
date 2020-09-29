const mongoose = require('mongoose');

const whatsappschema = new mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    received: Boolean
});
var messageContent = mongoose.model('messageContent',whatsappschema);
module.exports = {messageContent};



// module.exports =  mongoose.model('messageContent',whatsappschema);