const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  aadharCardNumber: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    default: "voter",
    enum: ["voter", "admin"],
  },
  password: {
    type: String,
    required: true,
  },

  isVoted: {
    default: false,
    type: Boolean,
  },
});

userSchema.pre("save", async function (next) {
  //hash pwd generate
  const employee = this;

  //hash the password only if the it has benn modified
  if (!employee.isModified("password")) return next();

  try {
    //hash the password generation

    const salt = await bcrypt.genSalt(10);

    // Create hash password

    const hashedPassword = await bcrypt.hash(employee.password, salt);
    employee.password = hashedPassword;
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};
const User = mongoose.model("User", userSchema);
module.exports = User;
