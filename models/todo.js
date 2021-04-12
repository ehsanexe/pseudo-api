const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  todos: {
    type: Array,
    required: [true, "todo value is null"],
  },
  user_fk: {
    type: String,
    unique: true,
    required: [true, "user_fk value is null"],
  },
});

// todoSchema.statics.getTodo = async function (user_fk) {
//   const todo = await this.findOne({ user_fk });
//   return todo;
// };

// todoSchema.statics.updateTodo = async function (user_fk, todos) {
//   const todo = await this.findOne({ user_fk });
//   todo = await todo.updateOne({ $push: { todos } });
//   return todo;
// };

const Todo = mongoose.model("todo", todoSchema);

module.exports = Todo;
