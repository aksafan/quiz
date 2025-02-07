const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Types = mongoose.Schema.Types;
const ROLES = {
  USER: "user",
  ADMIN: "admin",
};

const UserSchema = new mongoose.Schema({
  username: {
    type: Types.String,
    required: [true, "Please provide a username"],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    index: true,
  },
  email: {
    type: Types.String,
    required: [true, "Please provide email"],
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
    index: true,
  },
  password: {
    type: Types.String,
    required: [true, "Please provide password"],
    minlength: 8,
  },
  role: {
    type: Types.String,
    enum: Object.values(ROLES),
    default: "user",
  },
  createdAt: {
    type: Types.Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.methods.comparePassword = async function (passwordToCompare) {
  return bcrypt.compare(passwordToCompare, this.password);
};

module.exports = mongoose.model("User", UserSchema);
