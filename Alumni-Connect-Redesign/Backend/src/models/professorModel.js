const mongoose = require("mongoose");

const ProfessorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  department: {
    type: String,
  },
  role: {
    type: String,
    default: "professor",
  },
});

const Professor = mongoose.model("Professor", ProfessorSchema);
module.exports = Professor;
