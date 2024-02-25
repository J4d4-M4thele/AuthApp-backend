const user = require("../models/user");
const { hashPassword, comparePasswords } = require("../helpers/auth");

const test = (req, res) => {
    res.json("test is working")
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        //check if name was entered
        if (!name) {
            return res.json({
                error: "Name is required"
            })
        };
        //check if password is fine
        if (!password || password.length < 6) {
            return res.json({
                error: "Password is required and must be no less than 6 characters"
            })
        };
        //check email
        const exist = await user.findOne({ email });
        if (exist) {
            return res.json({
                error: "Email already taken"
            })
        };

        const hashedPassword = await hashPassword(password);

        //create user
        const User = await user.create({
            name, 
            email, 
            password: hashedPassword,
        });
        return res.json(User);
    } catch (error) {
        console.log(error);
    }
};

const loginUser = async (req, res) => {
 try {
    const {email, password} = req.body;
    //check if user exists
    const User = await user.findOne({email});
    if(!User) {
        return res.json({
            error: "No user found"
        })
    }
    //check matching passwords
    const match = await comparePasswords(password, User.password);
    if(match) {
        return res.json("Passwords match")
    }
 } catch (error) {
    console.log(error);
 }
};

module.exports = {
    test,
    registerUser,
    loginUser
};