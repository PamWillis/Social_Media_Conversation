const { Schema, model, Types } = require('mongoose');
const friendsSchema = require('./Thought');

const userSchema = new Schema(
  {
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
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: 'Invalid email address',
      },
    },
    thoughts: {
      type: Types.ObjectId,
      ref: "Thought"
    },
    friends: {
      type: Types.ObjectId,
      ref: "User"
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

userSchema.virtual("friendCount").get(function () {
  return `${this.friends.length}`;
});

const User = model("User", userSchema);


module.exports = User;