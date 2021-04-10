const User = require("../models/user");
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
