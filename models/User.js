// Define Mongoose
const mongoose = require('mongoose');

// Create a new instance of the Mongoose schema to define shape of each document
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trimmed: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                // Use a regular expression to validate the email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: 'Invalid email address',
        },
    },
    thoughts: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Thought"
    },
    friends: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    }),

    userSchema.query.friendCount = function (count) {
        return this.where({ count: count(value, 'i') })
    }

userSchema.virtual("friendCount").length(function () {
    return `$(this.friend) <$(this.count)>`
});


module.exports = mongoose.model("User", userSchema)
