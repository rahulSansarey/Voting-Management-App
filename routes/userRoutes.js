const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const { jwtMiddleware, generateToken } = require("../jwt.js");

// Signup routes
router.post("/signUp", async (req, res) => {
  try {
    const data = req.body;

    const newPerson = User(data);
    const response = await newPerson.save();

    console.log("Data saved");

    const payload = {
      id: response.id, // Correct the payload data
    };
    console.log(JSON.stringify(payload));
    const token = generateToken(payload); // Pass the payload object
    console.log("Token is : ", token);
    res.status(200).json({ response: response, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// login route

router.post("/login", async (req, res) => {
  try {
    // Extract eaadhaarcard  and password from request body
    const { aadharCardNumber, password } = req.body;

    // Find user by username

    const user = await User.findOne({
      aadharCardNumber: aadharCardNumber,
    });

    // if user does not exist or password does not match, return the error

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Inavlaid username aor Password" });
    }

    // Profile routes

    router.get("/profile", jwtMiddleware, async (req, res) => {
      try {
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({ user });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "internal Server error" });
      }
    });

    //Update Password routes

    router.put("/profile/password", async (req, res) => {
      try {
        const userId = req.user; // Extract the if from the token
        const { currentPassword, newPassword } = req.body; // Extract the current and new passwor from request body
        // Find the user by userId

        const user = await User.findById(userId);
        // If password doesn't match return error

        if (!(await user.comparePassword(password))) {
          return res
            .status(401)
            .json({ error: "Inavlaid username or Password" });
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        console.log("Data updated");
        res.status(200).json({ message: "Password Updated" });
      } catch (error) {
        res.status(404).json({ message: "Internal server error" });
      }
    });

    // Generate Token

    const payload = {
      id: user.id,
    };

    const token = generateToken(payload);

    //return token as response
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
