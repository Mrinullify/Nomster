let User = require("../Models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
require("dotenv").config();
const Router = express.Router();

// USER SIGNUP ++++++++++++++++++++++++++++++++++++++++++++

Router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  console.log(name, email, password);
  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      res
        .status(400)
        .json({ message: "This Email has already an account here" });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashPassword });
    await newUser.save();

    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "No account has been created with this email." });
    }

    // create jwt token
    // Sign jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "100h",
    });

    res
      .status(201)
      .json({ message: "User Created Successfully :)", user, token });
  } catch (error) {
    console.error("Error Creating User", error);
    res.status(500).json({ message: "Some issue when creating new user" });
  }
});

// LOGIN USER ++++++++++++++++++++++++++++++++++++++++++
Router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "No account has been created with this email." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password or email" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "100h",
    });

    return res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "token was not created" });
  }
});

// TOKEN IS VALID OR NOT ??
Router.post("/tokenIsValid", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(500).json({ msg: "No token was found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ msg: "Token matched yippie", decoded });
  } catch (error) {
    res.status(500).json({ msg: "token didnt matched" });
    console.error("the token didnt matched");
  }
});

module.exports = Router;
