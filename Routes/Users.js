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

// FETCHING ITEMS
Router.post("/saved", async (req, res) => {
  // SAVING RECIPE ID IN DATABASE
  const { user_id, recipe_id } = req.body;
  try {
    const user = await User.findById(user_id);
    if (!user) return res.status(400).json("Sorry User not found ");

    if (!user.savedRecipes.includes(recipe_id)) {
      user.savedRecipes.push(recipe_id);
      await user.save();
      return res.status(200).json({ msg: "Successfully saved Recipe id" });
    } else {
      return res.status(200).json("Recipe Already Saved.");
    }
  } catch (error) {
    console.error(`error: `, error);
    return res.status(500).json("Something went wrong not able to save");
  }
});

// UNSAVING RECIPE
Router.post("/unsaved", async (req, res) => {
  const { user_id, recipe_id } = req.body;
  try {
    const user = await User.findById(user_id);
    if (!user) return res.status(400).json({ msg: "User doesnt exists" });
    const index = user.savedRecipes.indexOf(recipe_id);
    if (index !== -1) {
      user.savedRecipes.splice(index, 1);
      await user.save();
      return res.status(200).json({ msg: "Successfully unsaved Recipe ID" });
    } else {
      return res.status(400).json({ msg: "Can't find the Recipe ID" });
    }
  } catch (error) {
    console.error("Something aint right  : ", error);
  }
});

// TO CHECK IF SAVED OR NOT
Router.post("/checkSaved", async (req, res) => {
  const { recipe_id, user_id } = req.body;
  console.log(recipe_id);
  console.log(user_id);
  const user = await User.findById(user_id);
  console.log(user.savedRecipes);
  if (!user) return res.json({ msg: "NO user Found" });
  if (user.savedRecipes.includes(recipe_id)) {
    console.log("yup yup it is saved !!");
    return res.status(200).json({ exist: true });
  } else {
    console.log("NO NO it's not saved");
    return res.status(200).json({ exist: false });
  }
});

// API FOR RETRIEVing SAVED RECIPE ID'S
Router.post("/savedRecipes", async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id); // Fetch the user by ID and await the result
    if (!user) return res.status(400).json({ msg: "No users found" });

    const recipes = user.savedRecipes; // Access the savedRecipes array directly
    console.log("Recipe id's are:", recipes);

    return res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// GIVING OUT PROFILE DETAILS THROUGH API
Router.post("/profileDetails", async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return console.log("USER ID DIDNT GET FETCHED THO");
    const user = await User.findById(user_id);
    if (!user) {
      console.error("User not found");
      return res.status(404).send("User not found");
    }
    if (user) {
      return res.status(200).json(user);
    } else return console.error("CANT FIND USER");
  } catch (error) {
    console.error("Error in the profile details API: ", error);
    return res.status(500).send("Internal server error");
  }
});

// SAVING NEW NAME FROM FRONTEND
Router.post("/saveNewName", async (req, res) => {
  const { userName, user_id } = req.body;
  try {
    const user = await User.findById(user_id);
    if (!user) return res.status(404).send("NO user find");
    if (user) {
      const updatedUser = await User.findByIdAndUpdate(
        user_id,
        { name: userName },
        { new: true }
      );
      return res.status(200).json(updatedUser);
    }
  } catch (error) {
    return res.status(500).send("Something failed in the new name saving api");
  }
});

// SAVING NEW EMAIL FROM FRONTEND
Router.post("/saveNewEmail", async (req, res) => {
  const { userEmail, user_id } = req.body;
  try {
    const user = await User.findById(user_id);
    if (!user) return res.status(404).send("NO user find");
    if (user) {
      const updatedUser = await User.findByIdAndUpdate(
        user_id,
        { email: userEmail },
        { new: true }
      );
      return res.status(200).json(updatedUser);
    }
  } catch (error) {
    return res.status(500).send("Something failed in the new name saving api");
  }
});

//Avatar selecting at signup page API
Router.post("/savingAvatar", async (req, res) => {
  const { userId, imageUrl } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json("No user found with this id");
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatarPic: imageUrl },
      { new: true }
    );
    return res.status(200).json({ msg: "Avatar picture has changed", user: updatedUser });
  } catch (error) {
    console.error("Error saving avatar:", error);
    return res.status(500).json("Something went wrong saving the avatar");
  }
});

module.exports = Router;
