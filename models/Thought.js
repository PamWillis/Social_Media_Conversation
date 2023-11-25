// Define Mongoose
const mongoose = require('mongoose');

const thoughtSchema = new mongoose.Schema({
    thoughtText: { type: String, required: true },
    min_length: 1,
    max_length: 280,
},
createdAt: {
    type: Date,
    imutable: true,
    default: () => Date.now(),
},
updatedAt: {
    type: Date,
    default: () => Date.now(),
}

userSchema.query.

userSchema.virtual("reactionCount").length(function () {
    return `$(this.reaction) <$(this.thoughts)>`
})

module.exports = thoughtSchema;