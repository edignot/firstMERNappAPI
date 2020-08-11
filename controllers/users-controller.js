const DUMMY_USERS = [
    {
        id: 'i1',
        name: 'name1',
        email: 'email1',
        password: 'password1',
    },
];

const { v4: uuid } = require('uuid');
const HttpError = require('../models/http-error');

const getUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS });
};
const signUp = (req, res, next) => {
    const { name, email, password } = req.body;

    const foundUser = DUMMY_USERS.find((user) => user.email === email);

    if (!foundUser) {
        const newUser = {
            id: uuid(),
            name,
            email,
            password,
        };

        DUMMY_USERS.push(newUser);
        res.status(201).json({ user: newUser });
    } else {
        next(new HttpError('email already exists', 422));
    }
};
const login = (req, res, next) => {
    const { email, password } = req.body;
    const foundUser = DUMMY_USERS.find(
        (user) => user.email === email && user.password === password
    );
    if (!foundUser) {
        next(new HttpError('User not found', 401));
    } else {
        res.json({ message: 'logged in' });
    }
};

exports.getUsers = getUsers;
exports.login = login;
exports.signUp = signUp;
