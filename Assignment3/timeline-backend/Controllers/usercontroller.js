const User = require("../Model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ success: false, error: "All fields are required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashed });
    await user.save();
    res.status(201).json({ success: true, message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, error: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ success: false, error: "Incorrect password" });

    const token = jwt.sign(
      { user: { _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email } },
      "secretkey",
      { expiresIn: "1d" }
    );
    res.cookie("usertoken", token, { httpOnly: true });
    res.json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,        // ← هاد كان ناقص
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Logout
const logout = (req, res) => {
  res.clearCookie("usertoken");
  res.json({ success: true, message: "Logout successful" });
};

module.exports = { signup, login, logout };
