const usermodel = require("../Model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Render Login / Signup Page
const rendersignuppage = (req, res) => {
    res.render("signuplogin", { message: null });
};


// ================= SIGN UP =================

const signup = (req, res) => {

    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.render("signuplogin", {
            message: "All fields are required"
        });
    }

    usermodel.findOne({ email: email })
    .then(existingUser => {

        if (existingUser) {
            return res.render("signuplogin", {
                message: "Email already exists"
            });
        }

        return bcrypt.hash(password, 10);

    })
    .then(hashedPassword => {

        if (!hashedPassword) return;

        const newUser = new usermodel({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        return newUser.save();

    })
    .then(() => {

        res.render("signuplogin", {
            message: "Signup successful! Please login."
        });

    })
    .catch(err => {

        console.log(err);
        res.render("signuplogin", {
            message: "Server error"
        });

    });
};


// ================= LOGIN =================

const login = (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.render("signuplogin", {
            message: "Please enter email and password"
        });
    }

    usermodel.findOne({ email: email })
    .then(user => {

        if (!user) {
            return res.render("signuplogin", {
                message: "User not found"
            });
        }

        return bcrypt.compare(password, user.password)
        .then(isMatch => {

            if (!isMatch) {
                return res.render("signuplogin", {
                    message: "Incorrect password"
                });
            }

            const token = jwt.sign(
                {
                    user: {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    }
                },
                "secretkey",
                { expiresIn: "1d" }
            );

            res.cookie("usertoken", token);
            res.redirect("/timeline");

        });

    })
    .catch(err => {

        console.log(err);
        res.render("signuplogin", {
            message: "Server error"
        });

    });
};


// ================= LOGOUT =================

const logout = (req, res) => {
    res.clearCookie("usertoken");
    res.redirect("/user/signup-login");
};


module.exports = {
    rendersignuppage,
    signup,
    login,
    logout
};