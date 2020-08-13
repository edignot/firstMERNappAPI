const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const User = require('../models/user.js');

const getUsers = async (req, res, next) => {
    const allUsers = await User.find({}, '-password');
    res.json({
        allUsers: allUsers.map((user) => user.toObject({ getters: true })),
    });
};

const signUp = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('invalid inputs', 422));
    }

    const { name, email, password, image, places } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        return next(new HttpError('signup failed', 500));
    }

    if (!existingUser) {
        const newUser = new User({
            name,
            email,
            password,
            image,
            places,
        });

        try {
            await newUser.save();
        } catch (err) {
            return next(new HttpError(`Couldn't create user`, 500));
        }

        res.status(201).json({
            newUser: newUser.toObject({ getters: true }),
        });
    } else {
        return next(new HttpError('email already exists', 422));
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    let foundUser;
    try {
        foundUser = await User.findOne({ email: email });
    } catch (err) {
        return next(new HttpError('login failed', 500));
    }

    if (!foundUser || foundUser.password !== password) {
        return next(new HttpError('invalid inputs', 401));
    }

    res.json({ message: 'logged in' });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signUp = signUp;
