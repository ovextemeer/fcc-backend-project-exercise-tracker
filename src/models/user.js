// Build model for project
let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username: String
});

module.exports = mongoose.model("User", userSchema);
// Build model for project