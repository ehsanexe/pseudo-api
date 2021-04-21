const User = require("../models/user");
const Todo = require("../models/todo");
const jwt = require("jsonwebtoken");

const handleError = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };
  console.log("ERROR:::", Object.values(err));

  if (err.message.includes("incorrect email")) {
    errors.email = "incorrect email";
    return errors;
  }
  if (err.message.includes("incorrect password")) {
    errors.password = "incorrect password";
    return errors;
  }

  if (err.code === 11000) {
    errors.email = "email already exist";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "my secret key?", { expiresIn: maxAge });
};

// module.exports.signup_get = (req, res) => {
//   res.render("signup");
// };

// module.exports.login_get = (req, res) => {
//   res.render("login");
// };

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    // res.cookie("jwtToken", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({
      userId: user._id,
      userEmail: user.email,
      jwtToken: token,
      jwtToken: token,
      message: "Account Created",
    });
  } catch (err) {
    const error = handleError(err);
    res.status(400).json({ error });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    // res.cookie("jwtToken", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({
      userId: user._id,
      userEmail: user.email,
      jwtToken: token,
      message: "Login successful",
    });
  } catch (err) {
    const error = handleError(err);
    res.status(400).json({ error });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwtToken", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports.auth_test = (req, res) => {
  const token = req.header("Authorization");
  console.log(token);
  let t = token.replace("Bearer", "");
  t = t.replace(" ", "");
  console.log(t);

  // res.cookie("jwtToken", "", { maxAge: 1 });
  jwt.verify(t, "my secret key?", async (err, decodedToken) => {
    // console.log(decodedToken);
    if (err) {
      console.log(err.message);
      // res.locals.user = null;
      // next();
      res.status(200).json({ message: err.message });
    } else {
      console.log(decodedToken);
      // let user = await User.findById(decodedToken.id);
      // res.locals.user = user;
      // next();
      res.status(200).json({ message: "success" });
    }
  });
};

module.exports.todos_get = async (req, res) => {
  const { user_fk } = req.body;
  try {
    const todo = await Todo.findOne({ user_fk });
    res.status(200).json(todo);
  } catch (err) {
    // console.log(err)
    res.status(400).json(err);
  }
};

module.exports.todos_update = async (req, res) => {
  const { user_fk, todos } = req.body;
  let user = await Todo.findOne({ user_fk });

  try {
    // const todo = await Todo.findOne();
    if (user) {
      let todo = await Todo.updateOne({ user_fk }, { $push: { todos } });
    } else {
      let todo = await Todo.create({ user_fk, todos });
    }

    res.status(200).json(todo);
  } catch (err) {
    // console.log(err)
    res.status(400).json(err);
  }
};

module.exports.todos_delete = async (req, res) => {
  const { user_fk, todo_id } = req.body;
  try {
    const todo = await Todo.updateOne(
      { user_fk },
      { $pull: { todos: { todo_id } } }
    );
    res.status(200).json(todo);
  } catch (err) {
    // console.log(err)
    res.status(400).json(err);
  }
};

module.exports.todos_create = async (req, res) => {
  const { user_fk, todos } = req.body;
  try {
    const todo = await Todo.create({ user_fk, todos });
    res.status(200).json(todo);
  } catch (err) {
    // console.log(err)
    res.status(400).json(err);
  }
};
