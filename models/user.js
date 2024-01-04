const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
});

module.exports = mongoose.model("User", userSchema);
