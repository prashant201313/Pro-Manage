const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const userSignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            ...req.body,
            password: hashedPassword
        })

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    }
    catch(err) {
        res.status(500).json({ message: err.message || err });
    }
}

const userSignIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: "Wrong credentials" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) {
            return res.status(400).json({ message: "Wrong credentials" });
        }
        else {
            const tokenData = {
                _id: user._id,
                email: user.email
            }

            const tokenOption = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                secure: true,
                sameSite: 'None',
            }
            
            const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: '8h' });
            res.cookie("token", token, tokenOption).json({ token, message: "Logged in successfully" });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message || err });
    }
}

const userDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({ "UserData": user });
    } 
    catch (err) {
        res.json({ message: err.message || err });
    }
}

const updateUser = async (req, res) => {
    const { newName, newEmail, oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    try {
        let updateFields = {};

        if (newName) {
            updateFields.name = newName;
        }

        if (newEmail) {
            updateFields.email = newEmail;
        }

        if (oldPassword && newPassword) {
            const user = await User.findById(userId);
            const isMatch = await bcrypt.compare(oldPassword, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: "Old password is incorrect" });
            }

            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(newPassword, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });
        res.status(200).json({ data: updatedUser, message: "User updated successfully" });

    } catch (error) {
        res.status(500).json({ message: err.message || err });
    }
}

const userLogout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully!"});
    }
    catch (err) {
        res.status(500).json({ message: err.message || err });
    }
}

const getAllUsersExceptCurrent = async (req, res) => {
    try {
        const currentUser = req.user._id;

        // Find all users excluding the current logged-in user
        const users = await User.find({ _id: { $ne: currentUser } }).select("name email");
        res.status(200).json({ data: users, message: "All users fetched except current user" });
    } 
    catch (err) {
        res.status(500).json({ message: err.message || err });
    }
};

const getAssigneeDetails = async (req, res) => {
    try {
        const assigneeId = req.params.id;

        const assignee = await User.findById(assigneeId);
        if (!assignee) {
            return res.status(404).json({ message: 'Assignee not found' });
        }
        
        res.status(200).json({ data: assignee, message: "Assignee details retrieved" });
    } 
    catch (err) {
        res.status(500).json({ message: err.message || err });
    }
};

module.exports = { userSignUp, userSignIn, userDetails, updateUser, userLogout, getAllUsersExceptCurrent, getAssigneeDetails };