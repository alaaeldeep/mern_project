import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

/* models */
import User from "../models/User.js";
import Note from "../models/Note.js";

/* get all users */
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password").lean();

    if (!users) {
        return res.status(400).json({ message: {} });
    }
    res.status(200).json(users);
});

/* create New User */
export const createNewUser = asyncHandler(async (req, res) => {
    const { userName, password, roles } = req.body;

    /* confirm data */
    if (!userName || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: "all fields required" });
    }

    /* check for duplicate */
    const duplicateUser = await User.findOne({ userName }).lean().exec();
    if (duplicateUser) {
        return res.status(409).json({ message: "duplicate userName " });
    }

    /* hash password */
    const hashPassword = await bcrypt.hash(password, 10);
    const userObject = { userName, roles, password: hashPassword };

    const user = await User.create(userObject);
    if (user) {
        res.status(201).json({ message: "new user created" });
    } else {
        return res.status(400).json({ message: "invalid userName " });
    }
});

/* update User */
export const updateUser = asyncHandler(async (req, res) => {
    const { id, userName, password, roles, active } = req.body;

    /* confirm data */
    if (
        !id ||
        !userName ||
        !password ||
        !Array.isArray(roles) ||
        !roles.length ||
        typeof active !== "boolean"
    ) {
        return res.status(400).json({ message: "all fields required" });
    }

    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: "user not found" });
    }
    /* check for duplicate */
    const duplicateUser = await User.findOne({ userName }).lean().exec();
    if (duplicateUser && !duplicateUser?._id.toString() !== id) {
        return res.status(409).json({ message: "duplicate userName " });
    }

    user.username = userName;
    user.active = active;
    user.roles = roles;

    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();
    res.status(200).json({ message: `User ${updatedUser.userName} updated` });
});

/* delete User */
export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    /* confirm data */
    if (!id) {
        return res.status(400).json({ message: "user id required" });
    }

    const notes = await Note.find({ user: id }).lean().exec();

    if (notes?.length) {
        return res.status(400).json({ message: "user has assigned to notes" });
    }
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: "user not found" });
    }

    const result = await User.deleteOne({ user });
    res.status(200).json({
        message: "User deleted successfully",
        data: result,
    });
});
